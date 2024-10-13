from flask import Blueprint, request, jsonify
from models import DireccionEntrega
from utils.db import db

direcciones_entrega = Blueprint('direcciones_entrega', __name__)

@direcciones_entrega.route('/api/guardar-direccion-entrega', methods=['POST'])
def guardar_direccion_entrega():
    data = request.get_json()

    try:
        nombre = data.get('nombre')
        direccion = data.get('direccion')
        telefono = data.get('telefono')
        latitud = data.get('lat')
        longitud = data.get('lng')

        nueva_direccion = DireccionEntrega(
            nombre_destinatario=nombre,
            descrip_direcEntrega=direccion,
            telefono=telefono,
            latitud_entrega=latitud,
            longitud_entrega=longitud
        )

        db.session.add(nueva_direccion)
        db.session.commit()

        return jsonify({'message': 'Dirección de entrega guardada exitosamente'}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error al guardar la dirección de entrega: {e}")
        return jsonify({'message': 'Error al guardar la dirección de entrega'}), 500