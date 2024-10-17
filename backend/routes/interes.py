from flask import Blueprint, jsonify, request
from utils.db import db
from models.interes import Interes
from datetime import datetime

interes = Blueprint("interes", __name__)

@interes.route('/api/registrar_interes', methods=['POST'])
def registrar_interes():
    try:
        data = request.get_json()
        tipo_material = data.get('id_tipoMaterial')
        usuario = data.get('id_usuario')
        fechaSelec = data.get('fecha_seleccion', datetime.now())

      
        # Validación de campos obligatorios
        if not tipo_material or not usuario:
            return jsonify({'message': 'id_tipoMaterial y id_usuario son obligatorios'}), 400


        nuevo_interes = interes(
            id_tipoMaterial=tipo_material,
            id_usuario=usuario,
            fecha_seleccion=fechaSelec
        )

        db.session.add(nuevo_interes)
        db.session.commit()

        return jsonify({
            'message': 'Interes registrado exitosamente',
            'data': {
                'material': nuevo_interes.id_tipoMaterial,
                'usuario': nuevo_interes.id_usuario,
                'fecha_seleccion': nuevo_interes.fecha_seleccion
            }
        }), 201

    except Exception as e:
        return jsonify({
            'message': 'Error al registrar el tipo de material',
            'error': str(e)
        }), 400

@interes.route('/api/intereses/<int:id_usuario>', methods=['GET'])
def obtener_intereses_usuario(id_usuario):
    try:
        intereses = interes.query.filter_by(id_usuario=id_usuario).all()

        if not intereses:
            return jsonify({'message': 'No se encontraron intereses para este usuario'}), 404
        
        # Convertir resultados a JSON
        data = [{
            'id_tipoMaterial': interes.id_tipoMaterial,
        } for interes in intereses]

        return jsonify({
            'message': 'Intereses obtenidos exitosamente',
            'data': data
        }), 200

    except Exception as e:
        return jsonify({
            'message': 'Error al obtener los tipos de material',
            'error': str(e)
        }), 400
    
@interes.route('/api/eliminar_intereses/<int:id_usuario>', methods=['DELETE'])
def eliminar_intereses_usuario(id_usuario):
    try:
        # Consultar todos los intereses del usuario
        intereses = interes.query.filter_by(id_usuario=id_usuario).all()

        if not intereses:
            return jsonify({'message': 'No se encontraron intereses para este usuario'}), 404

        # Eliminar todos los intereses del usuario
        for interes_obj in intereses:
            db.session.delete(interes_obj)

        db.session.commit()

        return jsonify({
            'message': f'Se eliminaron todos los intereses del usuario con id {id_usuario}'
        }), 200

    except Exception as e:
        return jsonify({
            'message': 'Error al eliminar los intereses del usuario',
            'error': str(e)
        }), 400
