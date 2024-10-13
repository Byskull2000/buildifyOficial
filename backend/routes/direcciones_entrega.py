# routes/direcciones_entrega.py

from flask import Blueprint, request, jsonify
from models.direccion_entrega import DireccionEntrega
from utils.db import db

direcciones_entrega = Blueprint('direcciones_entrega', __name__)

@direcciones_entrega.route('/api/guardar-direccion-entrega', methods=['POST'])
def guardar_direccion_entrega():
    data = request.get_json()
    nombre_destinatario = data.get('nombre')
    descrip_direcEntrega = data.get('direccion')
    telefono = data.get('telefono')
    latitud_entrega = data.get('lat')
    longitud_entrega = data.get('lng')

    # Verificar que todos los datos requeridos están presentes
    if not (nombre_destinatario and descrip_direcEntrega and telefono and latitud_entrega and longitud_entrega):
        return jsonify({'message': 'Datos incompletos'}), 400

    # Crear una nueva instancia del modelo DireccionEntrega
    nueva_direccion = DireccionEntrega(
        nombre_destinatario=nombre_destinatario,
        descrip_direcEntrega=descrip_direcEntrega,
        telefono=telefono,
        latitud_entrega=latitud_entrega,
        longitud_entrega=longitud_entrega
    )
    
    # Intentar guardar la nueva dirección en la base de datos
    try:
        db.session.add(nueva_direccion)
        db.session.commit()
        return jsonify({'message': 'Dirección de entrega guardada exitosamente'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error al guardar en la base de datos: {e}")
        return jsonify({'message': 'Error al guardar la dirección de entrega'}), 500