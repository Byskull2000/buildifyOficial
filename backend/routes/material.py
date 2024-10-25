from flask import Blueprint, jsonify, request
import base64
from utils.db import db
from models.material import Material
from models.tipo_material import TipoMaterial
from models.foto import Foto
material = Blueprint("material", __name__)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Función para verificar si la extensión de archivo es permitida
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
        if 'imagen' not in request.files:
            return jsonify({'message': 'La imagen del material es obligatoria'}), 400

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

        # Procesar las fotos enviadas (si las hay)
        if 'fotos' in request.files:
            fotos = request.files.getlist('fotos')  # Obtener todas las fotos subidas

            for foto in fotos:
                if foto and allowed_file(foto.filename):
                    # Leer el contenido de la imagen como binario
                    imagen_binaria = foto.read()

                    # Crear una nueva instancia de Foto
                    nueva_foto = Foto(
                        filename=foto.filename,
                        data=imagen_binaria,
                        id_material=nuevo_material.id_material  # Relacionar la foto con el material
                    )

                    # Guardar la foto en la base de datos
                    db.session.add(nueva_foto)

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
                'id_tipo_material': nuevo_material.id_tipo_material,
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
            'id_tipo_material': material.id_tipo_material,
            'fotos': [
                {
                    'id': foto.id,
                    'filename': foto.filename,
                    'data': base64.b64encode(foto.data).decode('utf-8')  # Codificar la imagen en base64
                } for foto in material.fotos  # Obtener todas las fotos asociadas al material
            ]   
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


@material.route('/api/materiales/<int:id>',methods=['PUT'])
def actualizar_material(id):
    
    material = Material.query.get(id)
    
    if not material:
        return jsonify({'message': 'Material no encontrado'}), 400
    
    data = request.get_json()
    nombre_material = data["nombre_material"]
    cantidad_material = data["cantidad_material"]
    estado_material = data["estado_material"]
    precio_material = data["precio_material"]
    descripcion_material = data["descripcion_material"]
    id_tipo_material = data["id_tipo_material"]
    
    tipo_material = TipoMaterial.query.get(id_tipo_material)
    if not tipo_material:
        return jsonify({'message': 'Tipo de material no válido'}), 400
    
    
    material.nombre_material = nombre_material
    material.estado_material = estado_material
    material.precio_material = precio_material
    material.descripcion_material = descripcion_material
    material.id_tipo_material = id_tipo_material
    material.cantidad_material = cantidad_material
    
    db.session.commit()
    
    return jsonify({'message': 'material actualizado'})     