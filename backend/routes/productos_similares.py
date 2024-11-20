from flask import Blueprint, jsonify, request
from utils.db import db
from models.material import Material  # Importa el modelo Material

# Crear un blueprint para productos similares
productos_similares = Blueprint('productos_similares', __name__)

@productos_similares.route('/api/productos-similares', methods=['GET'])
def obtener_productos_similares():
    # Obtener el ID del tipo de material desde los parámetros de consulta
    id_tipo_material = request.args.get('id_tipo_material', type=int)
    
    # Validación del parámetro
    if not id_tipo_material:
        return jsonify({"error": "El parámetro 'id_tipo_material' es obligatorio"}), 400

    # Filtrar materiales con el mismo tipo de material
    productos_similares = Material.query.filter_by(id_tipo_material=id_tipo_material).all()

    # Convertir los resultados a formato JSON
    resultado = [
        {
            "id_material": producto.id_material,
            "nombre_material": producto.nombre_material,
            "cantidad_material": producto.cantidad_material,
            "estado_material": producto.estado_material,
            "precio_material": producto.precio_material,
            "descripcion_material": producto.descripcion_material,
            "latitud_publicacion_material": producto.latitud_publicacion_material,
            "longitud_publicacion_material": producto.longitud_publicacion_material,
            "descripcion_direccion_material": producto.descripcion_direccion_material,
            "estado_publicacion_material": producto.estado_publicacion_material,
            "fecha_publicacion": producto.fecha_publicacion,
            "imagenUrl": (
                    producto.imagenes[0].url_imagen if producto.Material.imagenes else None
                ),
            "imagenes": [
                {"id_imagen": imagen.id_imagen, "url_imagen": imagen.url_imagen}
                for imagen in producto.Material.imagenes
            ],
        }
        for producto in productos_similares
    ]

    return jsonify(resultado), 200