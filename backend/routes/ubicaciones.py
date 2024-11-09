from flask import Blueprint, jsonify, request
from utils.db import db
from models.ubicacion import Ubicacion

ubicaciones = Blueprint('ubicaciones', __name__)
# Ruta para actualizar el perfil del usuario

@ubicaciones.route('/ubicacion', methods=['POST'])
def registrar_ubicacion():
    data = request.get_json()
    latitud = data.get('latitud')
    longitud = data.get('longitud')

    if not latitud or not longitud:
        return jsonify({'error': 'Faltan datos'}), 400

    nueva_ubicacion = Ubicacion(latitud=latitud, longitud=longitud)
    db.session.add(nueva_ubicacion)
    db.session.commit()

    return jsonify({'message': 'Ubicación registrada exitosamente'}), 201

# Ruta para obtener todas las ubicaciones
@ubicaciones.route('/ubicaciones', methods=['GET'])
def obtener_ubicaciones():
    ubicaciones = Ubicacion.query.all()
    lista_ubicaciones = [
        {'id_ubicacion': ubicacion.id_ubicacion, 'latitud': ubicacion.latitud, 'longitud': ubicacion.longitud}
        for ubicacion in ubicaciones
    ]