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
        return jsonify({'message': f'Error al guardar la dirección de entrega: {str(e)}'}), 500
