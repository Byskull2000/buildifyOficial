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

    try:
        # Extraer los datos del JSON recibido
        nombre = data.get('nombre')
        direccion = data.get('direccion')
        telefono = data.get('telefono')
        latitud = data.get('lat')
        longitud = data.get('lng')
        userID = data.get('usuario')

        # Crear una nueva instancia del modelo DireccionEntrega
        nueva_direccion = DireccionEntrega(
            nombre_destinatario=nombre,
            descrip_direcEntrega=direccion,
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
        return jsonify({'message': 'Error al guardar la dirección de entrega'}), 500

# Ruta para borrar una dirección de entrega por ID
@direcciones_entrega.route('/api/eliminar-direccion-entrega/<int:id>', methods=['DELETE'])
def eliminar_direccion_entrega(id):
    try:
        direccion = DireccionEntrega.query.get(id)

        if not direccion:
            return jsonify({'message': 'Dirección de entrega no encontrada'}), 404

        db.session.delete(direccion)
        db.session.commit()

        return jsonify({'message': 'Dirección de entrega eliminada exitosamente'}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al eliminar la dirección de entrega: {e}")
        return jsonify({'message': 'Error al eliminar la dirección de entrega'}), 500


# Ruta para editar una dirección de entrega por ID
@direcciones_entrega.route('/api/editar-direccion-entrega/<int:id>', methods=['PUT'])
def editar_direccion_entrega(id):
    data = request.get_json()

    try:
        direccion = DireccionEntrega.query.get(id)

        if not direccion:
            return jsonify({'message': 'Dirección de entrega no encontrada'}), 404

        # Actualizar los datos de la dirección
        direccion.nombre_destinatario = data.get('nombre', direccion.nombre_destinatario)
        direccion.descrip_direc_entrega = data.get('direccion', direccion.descrip_direc_entrega)
        direccion.telefono = data.get('telefono', direccion.telefono)
        direccion.latitud_entrega = data.get('lat', direccion.latitud_entrega)
        direccion.longitud_entrega = data.get('lng', direccion.longitud_entrega)

        db.session.commit()

        return jsonify({'message': 'Dirección de entrega actualizada exitosamente'}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al editar la dirección de entrega: {e}")
        return jsonify({'message': 'Error al editar la dirección de entrega'}), 500 