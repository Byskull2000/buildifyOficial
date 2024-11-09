from flask import Blueprint, jsonify, request
from utils.db import db
from models.tipo_material import TipoMaterial

tipo_material = Blueprint("tipo_material", __name__)


@tipo_material.route("/api/registrar_tipo_material", methods=["POST"])
def registrar_tipo_material():
    try:
        data = request.get_json()
        nombre_tipo_material = data.get("nombre_tipo_material")
        descripcion_tipoMaterial = data.get("descripcion_tipoMaterial")

        # Validación de campos obligatorios
        if not nombre_tipo_material:
            return (
                jsonify({"message": "El nombre del tipo de material es obligatorio"}),
                400,
            )

        nuevo_material = tipo_material(
            nombre_tipo_material=nombre_tipo_material,
            descripcion_tipoMaterial=descripcion_tipoMaterial,
        )

        db.session.add(nuevo_material)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Tipo de material registrado exitosamente",
                    "data": {
                        "id_tipoMaterial": nuevo_material.id_tipoMaterial,
                        "nombre_tipo_material": nuevo_material.nombre_tipo_material,
                        "descripcion_tipoMaterial": nuevo_material.descripcion_tipoMaterial,
                    },
                }
            ),
            201,
        )

    except Exception as e:
        return (
            jsonify(
                {"message": "Error al registrar el tipo de material", "error": str(e)}
            ),
            400,
        )


@tipo_material.route("/api/tipo_material", methods=["GET"])
def obtener_tipos_material():
    try:
        tipos_material = tipo_material.query.all()

        # Convertir resultados a JSON
        data = [
            {
                "id_tipoMaterial": tipo.id_tipoMaterial,
                "nombre_tipo_material": tipo.nombre_tipo_material,
                "descripcion_tipoMaterial": tipo.descripcion_tipoMaterial,
            }
            for tipo in tipos_material
        ]

        return (
            jsonify(
                {"message": "Tipos de material obtenidos exitosamente", "data": data}
            ),
            200,
        )

    except Exception as e:
        return (
            jsonify(
                {"message": "Error al obtener los tipos de material", "error": str(e)}
            ),
            400,
        )


@tipo_material.route("/api/tipo_material/<id>/materiales", methods=["GET"])
def obtener_tipo_material_por_id(id):
    tipo_material = TipoMaterial.query.get(id)

    if not tipo_material:
        return jsonify({"message": "No se encontró el tipo de material"}), 404

    materiales = []
    for material in tipo_material.materiales:
        materiales.append(
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
                "fecha_publicacion": material.fecha_publicacion
            }
        )

    return jsonify(
        {"data": materiales, "message": "Se obtuvieron los materiales exitosamente"}
    )
