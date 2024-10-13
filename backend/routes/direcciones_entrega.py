<<<<<<< HEAD
# backend/routes/direcciones_entrega.py

=======
>>>>>>> ac01f1f4fc05a5f3cd580abeb6d11c105b6f9f8b
from flask import Blueprint, request, jsonify
from models import direccion_entrega
from utils.db import db

# Crear el blueprint para las rutas de direcciones de entrega
direcciones_entrega = Blueprint('direcciones_entrega', __name__)

# Ruta para guardar una nueva dirección de entrega
@direcciones_entrega.route('/api/guardar-direccion-entrega', methods=['POST'])
def guardar_direccion_entrega():
    data = request.get_json()

    try:
<<<<<<< HEAD
        # Extraer los datos del JSON recibido
=======
>>>>>>> ac01f1f4fc05a5f3cd580abeb6d11c105b6f9f8b
        nombre = data.get('nombre')
        direccion = data.get('direccion')
        telefono = data.get('telefono')
        latitud = data.get('lat')
        longitud = data.get('lng')

<<<<<<< HEAD
        # Crear una nueva instancia del modelo DireccionEntrega
=======
>>>>>>> ac01f1f4fc05a5f3cd580abeb6d11c105b6f9f8b
        nueva_direccion = DireccionEntrega(
            nombre_destinatario=nombre,
            descrip_direcEntrega=direccion,
            telefono=telefono,
            latitud_entrega=latitud,
            longitud_entrega=longitud
        )

<<<<<<< HEAD
        # Guardar la nueva dirección en la base de datos
        db.session.add(nueva_direccion)
        db.session.commit()

        # Responder con un mensaje de éxito
=======
        db.session.add(nueva_direccion)
        db.session.commit()

>>>>>>> ac01f1f4fc05a5f3cd580abeb6d11c105b6f9f8b
        return jsonify({'message': 'Dirección de entrega guardada exitosamente'}), 200

    except Exception as e:
        # Hacer rollback en caso de error
        db.session.rollback()
        print(f"Error al guardar la dirección de entrega: {e}")
        return jsonify({'message': 'Error al guardar la dirección de entrega'}), 500