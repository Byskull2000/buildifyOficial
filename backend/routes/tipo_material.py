from flask import Blueprint, jsonify, request
from utils.db import db
from models.tipo_material import tipo_material

tipo_material = Blueprint("tipo_material", __name__)

@tipo_material.route('/api/registrar_tipo_material', methods=['POST'])
def registrar_tipo_material():
    try:
        data = request.get_json()
        nombre_tipo_material = data.get('nombre_tipo_material')
        descripcion_tipoMaterial = data.get('descripcion_tipoMaterial')

        # Validación de campos obligatorios
        if not nombre_tipo_material:
            return jsonify({'message': 'El nombre del tipo de material es obligatorio'}), 400

        nuevo_material = tipo_material(
            nombre_tipo_material=nombre_tipo_material,
            descripcion_tipoMaterial=descripcion_tipoMaterial
        )

        db.session.add(nuevo_material)
        db.session.commit()

        return jsonify({
            'message': 'Tipo de material registrado exitosamente',
            'data': {
                'id_tipoMaterial': nuevo_material.id_tipoMaterial,
                'nombre_tipo_material': nuevo_material.nombre_tipo_material,
                'descripcion_tipoMaterial': nuevo_material.descripcion_tipoMaterial
            }
        }), 201

    except Exception as e:
        return jsonify({
            'message': 'Error al registrar el tipo de material',
            'error': str(e)
        }), 400

@tipo_material.route('/api/tipo_material', methods=['GET'])
def obtener_tipos_material():
    try:
        tipos_material = tipo_material.query.all()

        # Convertir resultados a JSON
        data = [{
            'id_tipoMaterial': tipo.id_tipoMaterial,
            'nombre_tipo_material': tipo.nombre_tipo_material,
            'descripcion_tipoMaterial': tipo.descripcion_tipoMaterial
        } for tipo in tipos_material]

        return jsonify({
            'message': 'Tipos de material obtenidos exitosamente',
            'data': data
        }), 200

    except Exception as e:
        return jsonify({
            'message': 'Error al obtener los tipos de material',
            'error': str(e)
        }), 400