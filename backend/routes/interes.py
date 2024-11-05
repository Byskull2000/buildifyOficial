from flask import Blueprint, jsonify, request
from utils.db import db
from models.interes import Interes
from datetime import datetime

interes = Blueprint("interes", __name__)

@interes.route('/api/registrar_interes', methods=['POST'])
def registrar_interes():
    try:
        data = request.get_json()
        
        # Se espera una lista de IDs de materiales seleccionados
        materiales = data.get('intereses', [])
        usuario = data.get('id_usuario')

        print(f"Materiales recibidos: {materiales}")
        print(f"Usuario recibido: {usuario}")


        # Validación de campos obligatorios
        if not materiales:
            return jsonify({'message': 'materiales son obligatorios'}), 400
        
        if not usuario:
            return jsonify({'message': 'id_usuario es obligatorio'}), 400

        
         # Primero, eliminar los intereses previos del usuario
        intereses_previos = Interes.query.filter_by(id_usuario=usuario).all()
        print("eliminados:")

        if intereses_previos:
            for interes in intereses_previos:
                db.session.delete(interes)
            db.session.commit()  # Confirmar la eliminación de los intereses previos
            print(f"Intereses previos del usuario {usuario} eliminados.")

        
        # Generar la fecha de selección en el backend (una sola para todos los intereses)
        #fecha_seleccion = datetime.now()

        #print(f'fecha conseguida: {fecha_seleccion}')
        # Lista para almacenar los intereses que se van a registrar
        intereses_registrados = []

        for i in range(len(materiales)):
            material = materiales[i]  # Acceder al elemento usando el índice

            
            print(f"Material ID: {material} - Id material separado")  
            # Validar que cada ID de material es válido
            if not isinstance(material, int):
                return jsonify({'message': 'Cada material debe tener un id_tipoMaterial válido (entero)'}), 400

            
            
            # Crear una instancia de la clase interes por cada material
            nuevo_interes = Interes(
                id_tipo_material=material,
                id_usuario=usuario,
                #fecha_seleccion=fecha_seleccion
            )
            print('creado nuevo interes ') 
            print(nuevo_interes)

            # Agregar el nuevo interés a la lista de pendientes para insertar
            db.session.add(nuevo_interes)
            intereses_registrados.append(nuevo_interes)

        # Confirmar la transacción de todos los intereses
        db.session.commit()

        # Preparar los datos de respuesta
        respuesta = [{
            'material': i.id_tipo_material,
            'usuario': i.id_usuario,
            'fecha_seleccion': i.fecha_seleccion
        } for i in intereses_registrados]

        return jsonify({
            'message': 'Intereses registrados exitosamente',
            'data': respuesta
        }), 201

    except Exception as e:
        db.session.rollback()  # Hacer rollback en caso de error
        return jsonify({
            'message': 'Error al registrar los intereses',
            'error': str(e)
        }), 400


@interes.route('/api/intereses/<int:id_usuario>', methods=['GET'])
def obtener_intereses_usuario(id_usuario):
    try:
        intereses = Interes.query.filter_by(id_usuario=id_usuario).all()

        if not intereses:
            return jsonify({'message': 'No se encontraron intereses para este usuario'}), 404
        
        # Convertir resultados a JSON
        data = [{
            'id_tipoMaterial': interes.id_tipo_material,
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
        intereses = Interes.query.filter_by(id_usuario=id_usuario).all()

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
