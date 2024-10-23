from flask import Blueprint, jsonify, request
from utils.db import db
from models.material import Material

material = Blueprint("material", __name__)

@material.route('/api/registrar_material', methods=['POST'])
def registrar_material():
    try:
        data = request.get_json()

        # Obtener datos del material del cuerpo de la petición
        nombre_material = data.get('nombre_material')
        cantidad_material = data.get('cantidad_material')
        estado_material = data.get('estado_material')
        precio_material = data.get('precio_material')
        descripcion_material = data.get('descripcion_material')
        id_usuario = data.get('id_usuario')
        id_tipo_material = data.get('id_tipo_material')

        # Validación de campos obligatorios
        if not nombre_material:
            return jsonify({'message': 'El nombre del material es obligatorio'}), 400
        if not cantidad_material:
            return jsonify({'message': 'La cantidad del material es obligatoria'}), 400
        if not estado_material:
            return jsonify({'message': 'El estado del material es obligatorio'}), 400
        if not precio_material:
            return jsonify({'message': 'El precio del material es obligatorio'}), 400
        if not id_usuario:
            return jsonify({'message': 'El ID del usuario es obligatorio'}), 400
        if not id_tipo_material:
            return jsonify({'message': 'El ID del tipo de material es obligatorio'}), 400

        # Crear una nueva instancia del modelo Material
        nuevo_material = Material(
            nombre_material=nombre_material,
            cantidad_material=cantidad_material,
            estado_material=estado_material,
            precio_material=precio_material,
            descripcion_material=descripcion_material,
            id_usuario=id_usuario,
            id_tipo_material=id_tipo_material
        )

        # Añadir el nuevo material a la base de datos
        db.session.add(nuevo_material)
        db.session.commit()

        return jsonify({
            'message': 'Material registrado exitosamente',
            'data': {
                'id_material': nuevo_material.id_material,
                'nombre_material': nuevo_material.nombre_material,
                'cantidad_material': nuevo_material.cantidad_material,
                'estado_material': nuevo_material.estado_material,
                'precio_material': nuevo_material.precio_material,
                'descripcion_material': nuevo_material.descripcion_material,
                'id_usuario': nuevo_material.id_usuario,
                'id_tipo_material': nuevo_material.id_tipo_material
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': 'Error al registrar el material',
            'error': str(e)
        }), 400


@material.route('/api/materiales', methods=['GET'])
def obtener_materiales():
    try:
        materiales = Material.query.all()

        # Convertir resultados a JSON
        data = [{
            'id_material': material.id_material,
            'nombre_material': material.nombre_material,
            'cantidad_material': material.cantidad_material,
            'estado_material': material.estado_material,
            'precio_material': material.precio_material,
            'descripcion_material': material.descripcion_material,
            'id_usuario': material.id_usuario,
            'id_tipo_material': material.id_tipo_material
        } for material in materiales]

        return jsonify({
            'message': 'Materiales obtenidos exitosamente',
            'data': data
        }), 200

    except Exception as e:
        return jsonify({
            'message': 'Error al obtener los materiales',
            'error': str(e)
        }), 400

@material.route('/api/materiales/usuario/<int:id_usuario>', methods=['GET'])
def obtener_materiales_por_usuario(id_usuario):
    try:
        # Obtener los materiales filtrados por el id del usuario
        materiales = Material.query.filter_by(id_usuario=id_usuario).all()

        if not materiales:
            return jsonify({'message': 'No se encontraron materiales para este usuario'}), 404

        # Convertir resultados a JSON
        data = [{
            'id_material': material.id_material,
            'nombre_material': material.nombre_material,
            'cantidad_material': material.cantidad_material,
            'estado_material': material.estado_material,
            'precio_material': material.precio_material,
            'descripcion_material': material.descripcion_material,
            'id_usuario': material.id_usuario,
            'id_tipo_material': material.id_tipo_material
        } for material in materiales]

        return jsonify({
            'message': 'Materiales obtenidos exitosamente',
            'data': data
        }), 200

    except Exception as e:
        return jsonify({
            'message': 'Error al obtener los materiales',
            'error': str(e)
        }), 400


@material.route('/api/materiales/tipo/<int:id_tipo_material>', methods=['GET'])
def obtener_materiales_por_tipo_material(id_tipo_material):
    try:
        # Obtener los materiales filtrados por el tipo de material
        materiales = Material.query.filter_by(id_tipo_material=id_tipo_material).all()

        if not materiales:
            return jsonify({'message': 'No se encontraron materiales para este tipo de material'}), 404

        # Convertir resultados a JSON
        data = [{
            'id_material': material.id_material,
            'nombre_material': material.nombre_material,
            'cantidad_material': material.cantidad_material,
            'estado_material': material.estado_material,
            'precio_material': material.precio_material,
            'descripcion_material': material.descripcion_material,
            'id_usuario': material.id_usuario,
            'id_tipo_material': material.id_tipo_material
        } for material in materiales]

        return jsonify({
            'message': 'Materiales obtenidos exitosamente',
            'data': data
        }), 200

    except Exception as e:
        return jsonify({
            'message': 'Error al obtener los materiales',
            'error': str(e)
        }), 400

@material.route('/api/materiales/<int:id_material>', methods=['GET'])
def obtener_material_por_id(id_material):
    try:
        # Buscar el material por su ID
        material = Material.query.get(id_material)

        if not material:
            return jsonify({'message': 'Material no encontrado'}), 404

        # Convertir el material a JSON
        data = {
            'id_material': material.id_material,
            'nombre_material': material.nombre_material,
            'cantidad_material': material.cantidad_material,
            'estado_material': material.estado_material,
            'precio_material': material.precio_material,
            'descripcion_material': material.descripcion_material,
            'id_usuario': material.id_usuario,
            'id_tipo_material': material.id_tipo_material
        }

        return jsonify({
            'message': 'Material obtenido exitosamente',
            'data': data
        }), 200

    except Exception as e:
        return jsonify({
            'message': 'Error al obtener el material',
            'error': str(e)
        }), 400
