# backend/routes/direcciones_entrega.py

from flask import Blueprint, request, jsonify
from models.direccion_entrega import DireccionEntrega
from utils.db import db

# Crear el blueprint para las rutas de direcciones de entrega
direcciones_entrega = Blueprint('direcciones_entrega', __name__)

# Ruta para guardar una nueva dirección de entrega
@direcciones_entrega.route('/api/guardar-direccion-entrega', methods=['POST'])
def guardar_direccion_entrega():
    data = request.get_json()

    # Validar los datos requeridos
    nombre = data.get('nombre')
    direccion = data.get('direccion')
    telefono = data.get('telefono')
    latitud = data.get('lat')
    longitud = data.get('lng')
    userID = data.get('usuario')

    if not all([nombre, direccion, telefono, latitud, longitud, userID]):
        return jsonify({'message': 'Todos los campos son requeridos.'}), 400

    try:
        print(f"Datos recibidos: {data}")
        
        # Crear una nueva instancia del modelo DireccionEntrega
        nueva_direccion = DireccionEntrega(
            nombre_destinatario=nombre,
            descrip_direc_entrega=direccion,
            telefono=telefono,
            latitud_entrega=latitud,
            longitud_entrega=longitud,
            id_usuario=userID
        )

        # Guardar la nueva dirección en la base de datos
        db.session.add(nueva_direccion)
        db.session.commit()

        # Responder con un mensaje de éxito
        return jsonify({'message': 'Dirección de entrega guardada exitosamente'}), 200

    except Exception as e:
        # Hacer rollback en caso de error
        db.session.rollback()
        print(f"Error al guardar la dirección de entrega: {e}")
        return jsonify({'message': f'Error al guardar la dirección de entrega: {str(e)}'}), 500


# Ruta para obtener todas las direcciones de entrega de un usuario
@direcciones_entrega.route('/api/direcciones-entrega/<int:id_usuario>', methods=['GET'])
def obtener_direcciones_entrega(id_usuario):
    try:
        # Buscar las direcciones de entrega asociadas al usuario
        direcciones = DireccionEntrega.query.filter_by(id_usuario=id_usuario).all()

        # Verificar si el usuario tiene direcciones guardadas
        if not direcciones:
            return jsonify({'message': 'No se encontraron direcciones de entrega para el usuario.'}), 404

        # Convertir las direcciones a JSON
        data = [{
            'id_direccion_entrega': direccion.id_direccion_entrega,
            'nombre_destinatario': direccion.nombre_destinatario,
            'descrip_direc_entrega': direccion.descrip_direc_entrega,
            'telefono': direccion.telefono,
            'latitud_entrega': direccion.latitud_entrega,
            'longitud_entrega': direccion.longitud_entrega,
            'id_usuario': direccion.id_usuario
        } for direccion in direcciones]

        # Responder con la lista de direcciones
        return jsonify({
            'message': 'Direcciones de entrega obtenidas exitosamente',
            'data': data
        }), 200

    except Exception as e:
        print(f"Error al obtener las direcciones de entrega: {e}")
        return jsonify({'message': f'Error al obtener las direcciones de entrega: {str(e)}'}), 500


# Ruta para eliminar una dirección de entrega por su ID
@direcciones_entrega.route('/api/eliminar-direccion-entrega/<int:id_direccion>', methods=['DELETE'])
def eliminar_direccion_entrega(id_direccion):
    try:
        # Buscar la dirección de entrega por su ID
        direccion = DireccionEntrega.query.get(id_direccion)

        # Verificar si la dirección existe
        if not direccion:
            return jsonify({'message': 'Dirección de entrega no encontrada'}), 404

        # Eliminar la dirección de la base de datos
        db.session.delete(direccion)
        db.session.commit()

        # Responder con un mensaje de éxito
        return jsonify({'message': 'Dirección de entrega eliminada exitosamente'}), 200

    except Exception as e:
        # Hacer rollback en caso de error
        db.session.rollback()
        print(f"Error al eliminar la dirección de entrega: {e}")
        return jsonify({'message': f'Error al eliminar la dirección de entrega: {str(e)}'}), 500
