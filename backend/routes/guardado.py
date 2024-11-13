from flask import Blueprint, jsonify, request
import base64

from sqlalchemy import func
from backend.models.material import Material
from utils.db import db
from models.guardado import Guardado

guardado = Blueprint("guardado", __name__)


# Función para verificar si la extensión de archivo es permitida

@guardado.route("/api/guardar-material", methods=["POST"])
def guardar_material():
    try:
        # Obtener datos del material del cuerpo de la petición
        data = request.form

        usuario = data.get("usuario")
        material = data.get("material")

        # Validación de campos obligatorios
        if not usuario:
            return jsonify({"message": "El usuario es obligatorio"}), 400
        if not material:
            return jsonify({"message": "El material es obligatoria"}), 400

        material_guardado = Guardado(
            id_material=material,
            id_usuario=usuario,
        )

        db.session.add(material_guardado)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Material guardado exitosamente",
                    "data": {
                        "fecha_guardado": material_guardado.fecha_guardado,
                        "material_guardado": material_guardado.id_material,
                        "usuario": material_guardado.id_usuario,
                    },
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        print(e)
        return (
            jsonify({"message": "Error al guardadr el material", "error": str(e)}),
            400,
        )


@guardado.route('/api/materiales/guardados/<int:id_usuario>', methods=['GET'])
def obtener_materiales_guardados(id_usuario):
    try:
        # Realizar la consulta de los materiales guardados por el usuario en orden descendente de fecha de guardado
        materiales_guardados = db.session.query(Material).join(Guardado) \
            .filter(Guardado.id_usuario == id_usuario) \
            .order_by(Guardado.fecha_guardado.desc()) \
            .all()

        if not materiales_guardados:
            return jsonify({'message': 'No se encontraron materiales guardados para el usuario especificado'}), 404

        # Convertir los materiales a un formato JSON con toda la información de cada material
        data = [{
            'fecha_guardado': guardado_mat.fecha_guardado,
            'id_material': guardado_mat.id_material,
            'nombre_material': guardado_mat.nombre_material,
            'cantidad_material': guardado_mat.cantidad_material,
            'estado_material': guardado_mat.estado_material,
            'precio_material': guardado_mat.precio_material,
            'descripcion_material': guardado_mat.descripcion_material,
            'id_usuario': guardado_mat.id_usuario,
            'id_tipo_material': guardado_mat.id_tipo_material,
            'latitud_publicacion_material': guardado_mat.latitud_publicacion_material,
            'longitud_publicacion_material': guardado_mat.longitud_publicacion_material,
            'descripcion_direccion_material': guardado_mat.descripcion_direccion_material,
            'estado_publicacion_material': guardado_mat.estado_publicacion_material,
            'fecha_publicacion': guardado_mat.fecha_publicacion,
            'tipo_unidad_material': guardado_mat.tipo_unidad_material,
        } for guardado_mat in materiales_guardados]

        return jsonify({
            'message': 'Materiales guardados obtenidos exitosamente',
            'data': data
        }), 200

    except Exception as e:
        return jsonify({
            'message': 'Error al obtener materiales guardados',
            'error': str(e)
        }), 500


@guardado.route("/api/materiales/guardados/filtrar_avanzado", methods=["GET", "POST"])
def filtrar_materiales_guardados_avanzado():
    try:
        # Obtener los filtros desde el cuerpo de la petición
        data = request.get_json()

        if not data:
            return jsonify({"message": "No se proporcionaron datos JSON"}), 400

        # Parámetros de filtrado
        id_usuario = data.get("id_usuario")
        nombre_material = data.get("nombre_material", None)
        id_tipo_material = data.get("id_tipo_material", None)
        estado_material = data.get("estado_material", None)
        min_precio = data.get("min_precio", None)
        max_precio = data.get("max_precio", None)
        orden_precio = data.get("orden_precio")  # Ordenar por precio
        ciudad = data.get("ciudad", None)  # Buscar por ciudad

        # Validar parámetro obligatorio
        if not id_usuario:
            return jsonify({"message": "El id_usuario es obligatorio"}), 400

        # Iniciar la consulta para obtener los materiales guardados del usuario
        query = db.session.query(Material).join(Guardado) \
            .filter(Guardado.id_usuario == id_usuario)

        # Aplicar filtros opcionales si los valores son proporcionados
        if nombre_material:
            query = query.filter(Material.nombre_material.ilike(f"%{nombre_material}%"))

        if id_tipo_material is not None:
            query = query.filter_by(id_tipo_material=id_tipo_material)

        if estado_material:
            query = query.filter_by(estado_material=estado_material)

        if min_precio is not None and max_precio is not None:
            query = query.filter(
                Material.precio_material.cast(db.Float) >= min_precio,
                Material.precio_material.cast(db.Float) <= max_precio,
            )
        elif min_precio is not None:
            query = query.filter(Material.precio_material.cast(db.Float) >= min_precio)
        elif max_precio is not None:
            query = query.filter(Material.precio_material.cast(db.Float) <= max_precio)

        if ciudad:
            query = query.filter(Material.descripcion_direccion_material.ilike(f"%{ciudad}%"))

        # Ordenar por precio si se proporciona
        if orden_precio == "asc":
            query = query.order_by(Material.precio_material.asc())
        elif orden_precio == "desc":
            query = query.order_by(Material.precio_material.desc())

        # Ejecutar la consulta
        materiales = query.all()

        if not materiales:
            return jsonify({"message": "No se encontraron materiales guardados que coincidan con los filtros"}), 404

        # Convertir resultados a JSON
        data = [
            {
                "id_material": material.id_material,
                "nombre_material": material.nombre_material,
                "cantidad_material": material.cantidad_material,
                "estado_material": material.estado_material,
                "precio_material": material.precio_material,
                "descripcion_material": material.descripcion_material,
                "id_usuario": material.id_usuario,
                "id_tipo_material": material.id_tipo_material,
                "latitud_publicacion_material": material.latitud_publicacion_material,
                "longitud_publicacion_material": material.longitud_publicacion_material,
                "descripcion_direccion_material": material.descripcion_direccion_material,
                "estado_publicacion_material": material.estado_publicacion_material,
                "fecha_publicacion": material.fecha_publicacion,
                "tipo_unidad_material": material.tipo_unidad_material,
                "imagenUrl": (material.imagenes[0].url_imagen if material.imagenes else None),
                "imagenes": [
                    {"id_imagen": imagen.id_imagen, "url_imagen": imagen.url_imagen}
                    for imagen in material.imagenes
                ],
            }
            for material in materiales
        ]

        return jsonify({"message": "Materiales guardados obtenidos exitosamente", "data": data}), 200

    except Exception as e:
        return jsonify({"message": "Error al buscar materiales guardados", "error": str(e)}), 400
