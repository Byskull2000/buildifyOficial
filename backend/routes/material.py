from flask import Blueprint, jsonify, request
import base64

from sqlalchemy import func
from models.interes import Interes
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
        #data = request.form
        data = request.get_json()

        # Obtener datos del material del cuerpo de la petición
        nombre_material = data.get('nombre_material')
        cantidad_material = data.get('cantidad_material')
        estado_material = data.get('estado_material')
        precio_material = data.get('precio_material')
        descripcion_material = data.get('descripcion_material')
        latitud_publicacion_material = data.get('latitud_publicacion_material')
        longitud_publicacion_material = data.get('longitud_publicacion_material')
        descripcion_direccion_material = data.get('descripcion_direccion_material')
        id_usuario = data.get('id_usuario')
        id_tipo_material = data.get('id_tipo_material')
        tipo_unidad_material = data.get('tipo_unidad_material')

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
            latitud_publicacion_material=latitud_publicacion_material,
            longitud_publicacion_material=longitud_publicacion_material,
            descripcion_direccion_material=descripcion_direccion_material,
            id_usuario=id_usuario,
            id_tipo_material=id_tipo_material,
            tipo_unidad_material=tipo_unidad_material
        )

        # Añadir el nuevo material a la base de datos
        db.session.add(nuevo_material)
        db.session.commit()  # Hacer commit de material y fotos

        # Ahora vamos a manejar las fotos (si las hay) y asociarlas al material
        if 'fotos' in request.files:
            fotos = request.files.getlist('fotos')  # Obtener todas las fotos subidas

            # Procesar cada foto
            for foto in fotos:
                if foto and allowed_file(foto.filename):
                    # Leer el contenido de la imagen como binario
                    imagen_binaria = foto.read()

                    # Crear una nueva instancia de Foto y asociarla al material
                    nueva_foto = Foto(
                        filename=foto.filename,
                        data=imagen_binaria,
                        id_material=nuevo_material.id_material  # Relacionar la foto con el material
                    )

                    # Guardar la foto en la base de datos
                    db.session.add(nueva_foto)

            db.session.commit()  # Guardar las fotos en la base de datos

        return jsonify({
            'message': 'Material registrado exitosamente',
            'data': {
                'id_material': nuevo_material.id_material,
                'nombre_material': nuevo_material.nombre_material,
                'cantidad_material': nuevo_material.cantidad_material,
                'estado_material': nuevo_material.estado_material,
                'precio_material': nuevo_material.precio_material,
                'descripcion_material': nuevo_material.descripcion_material,
                'latitud_publicacion_material': nuevo_material.latitud_publicacion_material,
                'longitud_publicacion_material': nuevo_material.longitud_publicacion_material,
                'descripcion_direccion_material': nuevo_material.descripcion_direccion_material,
                'estado_publicacion_material': nuevo_material.estado_publicacion_material,
                'fecha_publicacion': nuevo_material.fecha_publicacion,
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
    
    
@material.route('/api/imagenes', methods=['POST'])
def subir_imagenes():
    try:
        # Verificar si el ID del material y las fotos están en la solicitud
        id_material = request.form.get('id_material')
        if not id_material:
            return jsonify({'message': 'El ID del material es obligatorio'}), 400

        # Validar que el material existe
        material = Material.query.get(id_material)
        if not material:
            return jsonify({'message': 'El material no existe'}), 404

        # Procesar las fotos enviadas
        if 'fotos' not in request.files:
            return jsonify({'message': 'Las imágenes son obligatorias'}), 400

        fotos = request.files.getlist('fotos')  # Obtener todas las fotos subidas

        for foto in fotos:
            if foto and allowed_file(foto.filename):
                # Leer el contenido de la imagen como binario
                imagen_binaria = foto.read()

                # Crear una nueva instancia de Foto
                nueva_foto = Foto(
                    filename=foto.filename,
                    data=imagen_binaria,
                    id_material=id_material  # Relacionar la foto con el material
                )

                # Guardar la foto en la base de datos
                db.session.add(nueva_foto)

        db.session.commit()

        return jsonify({
            'message': 'Imágenes subidas exitosamente',
            'data': {'id_material': id_material}
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': 'Error al subir las imágenes',
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
            'id_tipo_material': material.id_tipo_material,
            'latitud_publicacion_material': material.latitud_publicacion_material,
            'longitud_publicacion_material': material.longitud_publicacion_material,
            'descripcion_direccion_material': material.descripcion_direccion_material,
            'estado_publicacion_material': material.estado_publicacion_material,
            'fecha_publicacion': material.fecha_publicacion
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
            'id_tipo_material': material.id_tipo_material,
            'latitud_publicacion_material': material.latitud_publicacion_material,
            'longitud_publicacion_material': material.longitud_publicacion_material,
            'descripcion_direccion_material': material.descripcion_direccion_material,
            'estado_publicacion_material': material.estado_publicacion_material,
            'fecha_publicacion': material.fecha_publicacion
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
        # Realizar un join con la tabla 'tipo_material' y buscar el material por su ID
        print('inicia')
        resultado = db.session.query(Material, TipoMaterial).join(TipoMaterial, Material.id_tipo_material == TipoMaterial.id_tipo_material).filter(Material.id_material == id_material).first()

        if not resultado:
            return jsonify({'message': 'Material no encontrado'}), 404

        material, tipo_material = resultado

        # Convertir el material a JSON, incluyendo el nombre del tipo de material
        data = {
            'id_material': material.id_material,
            'nombre_material': material.nombre_material,
            'cantidad_material': material.cantidad_material,
            'estado_material': material.estado_material,
            'precio_material': material.precio_material,
            'descripcion_material': material.descripcion_material,
            'id_usuario': material.id_usuario,
            'id_tipo_material': material.id_tipo_material,
            'nombre_tipo_material': tipo_material.nombre_tipo_material,  # Agregar el nombre del tipo de material
            'latitud_publicacion_material': material.latitud_publicacion_material,
            'longitud_publicacion_material': material.longitud_publicacion_material,
            'descripcion_direccion_material': material.descripcion_direccion_material,
            'estado_publicacion_material': material.estado_publicacion_material,
            'fecha_publicacion': material.fecha_publicacion,
            'tipo_unidad_material': material.tipo_unidad_material
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


@material.route('/api/materiales/rango_precio', methods=['GET'])
def obtener_materiales_por_rango_precio():
    try:
        # Obtener los valores min y max del rango de precios desde los parámetros de la consulta
        min_precio = request.args.get('min_precio', type=float)
        max_precio = request.args.get('max_precio', type=float)

        # Validar que se hayan proporcionado ambos valores
        if min_precio is None or max_precio is None:
            return jsonify({'message': 'Se deben proporcionar los valores min_precio y max_precio'}), 400

        # Filtrar materiales según el rango de precios
        materiales = Material.query.filter(
            Material.precio_material.cast(db.Float) >= min_precio,
            Material.precio_material.cast(db.Float) <= max_precio
        ).all()

        if not materiales:
            return jsonify({'message': 'No se encontraron materiales en el rango de precios especificado'}), 404

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
            'latitud_publicacion_material': material.latitud_publicacion_material,
            'longitud_publicacion_material': material.longitud_publicacion_material,
            'descripcion_direccion_material': material.descripcion_direccion_material,
            'estado_publicacion_material': material.estado_publicacion_material,
            'fecha_publicacion': material.fecha_publicacion
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


@material.route('/api/materiales/estado/<string:estado_material>', methods=['GET'])
def obtener_materiales_por_estado(estado_material):
    try:
        # Filtrar materiales según el estado
        materiales = Material.query.filter_by(estado_material=estado_material).all()

        if not materiales:
            return jsonify({'message': 'No se encontraron materiales con el estado especificado'}), 404

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
            'latitud_publicacion_material': material.latitud_publicacion_material,
            'longitud_publicacion_material': material.longitud_publicacion_material,
            'descripcion_direccion_material': material.descripcion_direccion_material,
            'estado_publicacion_material': material.estado_publicacion_material,
            'fecha_publicacion': material.fecha_publicacion
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


@material.route('/api/materiales/buscar', methods=['GET'])
def buscar_materiales():
    try:
        # Obtener el texto de búsqueda desde los parámetros de la consulta
        texto_busqueda = request.args.get('texto')

        # Validar que se haya proporcionado el texto de búsqueda
        if not texto_busqueda:
            return jsonify({'message': 'Se debe proporcionar el texto de búsqueda'}), 400

        # Filtrar materiales que contengan el texto en el nombre
        materiales = Material.query.filter(Material.nombre_material.ilike(f'%{texto_busqueda}%')).all()

        if not materiales:
            return jsonify({'message': 'No se encontraron materiales que coincidan con la búsqueda'}), 404

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
            'latitud_publicacion_material': material.latitud_publicacion_material,
            'longitud_publicacion_material': material.longitud_publicacion_material,
            'descripcion_direccion_material': material.descripcion_direccion_material,
            'estado_publicacion_material': material.estado_publicacion_material,
            'fecha_publicacion': material.fecha_publicacion
        } for material in materiales]

        return jsonify({
            'message': 'Materiales obtenidos exitosamente',
            'data': data
        }), 200

    except Exception as e:
        return jsonify({
            'message': 'Error al buscar materiales',
            'error': str(e)
        }), 400


@material.route('/api/materiales/filtrar_interes', methods=['GET','POST'])
def filtrar_materiales_por_interes():
    try:
        # Obtener los filtros desde el cuerpo de la petición
        data = request.get_json()

        if not data:
            return jsonify({'message': 'No se proporcionaron datos JSON'}), 400

        id_usuario = data.get('id_usuario', None)
        ciudad = data.get('ciudad', None)

        if id_usuario is None or ciudad is None:
            return jsonify({'message': 'Faltan parámetros obligatorios: id_usuario o ciudad'}), 400

        # Obtener todos los id_tipo_material que interesan al usuario
        tipos_interes = Interes.query.filter_by(id_usuario=id_usuario).all()
        id_tipos_material = [interes.id_tipo_material for interes in tipos_interes]

        # Filtrar los materiales en función de si el usuario tiene intereses registrados
        if id_tipos_material:
            # Si el usuario tiene intereses, filtrar por intereses, ciudad y estado activo
            materiales = Material.query \
                .filter(Material.id_tipo_material.in_(id_tipos_material)) \
                .filter(Material.descripcion_direccion_material.ilike(f'%{ciudad}%')) \
                .filter_by(estado_publicacion_material='activo') \
                .all()
        else:
            # Si el usuario no tiene intereses, solo filtrar por ciudad y estado activo
            materiales = Material.query \
                .filter(Material.descripcion_direccion_material.ilike(f'%{ciudad}%')) \
                .filter_by(estado_publicacion_material='activo') \
                .all()
        if not materiales:
            return jsonify({'message': 'No se encontraron materiales que coincidan con los intereses y filtros'}), 404

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
            'latitud_publicacion_material': material.latitud_publicacion_material,
            'longitud_publicacion_material': material.longitud_publicacion_material,
            'descripcion_direccion_material': material.descripcion_direccion_material,
            'estado_publicacion_material': material.estado_publicacion_material,
            'fecha_publicacion': material.fecha_publicacion,
            'tipo_unidad_material': material.tipo_unidad_material,
        } for material in materiales]

        return jsonify({
            'message': 'Materiales obtenidos exitosamente',
            'data': data
        }), 200

    except Exception as e:
        return jsonify({
            'message': 'Error al buscar materiales por intereses',
            'error': str(e)
        }), 400



@material.route('/api/materiales/buscar_avanzado', methods=['GET','POST'])
def buscar_materiales_avanzado():
    try:
        # Obtener los filtros desde el cuerpo de la petición
        data = request.get_json()

        if not data:
            return jsonify({'message': 'No se proporcionaron datos JSON'}), 400
        
        nombre_material = data.get('nombre_material', None)
        id_tipo_material = data.get('id_tipo_material', None)
        estado_material = data.get('estado_material', None)
        min_precio = data.get('min_precio', None)
        max_precio = data.get('max_precio', None)
        orden_precio = data.get('orden_precio')  # Nuevo campo para ordenar por precio
        ciudad = data.get('ciudad', None)  # Nuevo campo para buscar por ciudad        


        # Iniciar la consulta de materiales
        query = Material.query

        # Aplicar filtros si los valores son proporcionados
        if nombre_material:
            query = query.filter(Material.nombre_material.ilike(f'%{nombre_material}%'))
        
        if id_tipo_material is not None:  # Usar is not None para permitir 0 como valor
            query = query.filter_by(id_tipo_material=id_tipo_material)

        if estado_material:
            query = query.filter_by(estado_material=estado_material)

        if min_precio is not None and max_precio is not None:
            query = query.filter(
                Material.precio_material.cast(db.Float) >= min_precio,
                Material.precio_material.cast(db.Float) <= max_precio
            )
        elif min_precio is not None:  # Solo filtrar por mínimo si se proporciona
            query = query.filter(Material.precio_material.cast(db.Float) >= min_precio)
        elif max_precio is not None:  # Solo filtrar por máximo si se proporciona
            query = query.filter(Material.precio_material.cast(db.Float) <= max_precio)

        if ciudad:
            query = query.filter(Material.descripcion_direccion_material.ilike(f'%{ciudad}%'))
        
        # Ordenar por precio si se proporciona el campo de orden_precio
        if orden_precio == 'asc':
            query = query.order_by(Material.precio_material.asc())
        elif orden_precio == 'desc':
            query = query.order_by(Material.precio_material.desc())

        # Obtener los materiales que coinciden con los filtros aplicados
        materiales = query.all()

        if not materiales:
            return jsonify({'message': 'No se encontraron materiales que coincidan con los filtros'}), 404

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
            'latitud_publicacion_material': material.latitud_publicacion_material,
            'longitud_publicacion_material': material.longitud_publicacion_material,
            'descripcion_direccion_material': material.descripcion_direccion_material,
            'estado_publicacion_material': material.estado_publicacion_material,
            'fecha_publicacion': material.fecha_publicacion,
            'tipo_unidad_material': material.tipo_unidad_material, 
        } for material in materiales]

        return jsonify({
            'message': 'Materiales obtenidos exitosamente',
            'data': data
        }), 200

    except Exception as e:
        return jsonify({
            'message': 'Error al buscar materiales',
            'error': str(e)
        }), 400

@material.route('/api/editar-material/<int:id>',methods=['PUT'])
def actualizar_material(id):
    try:
        
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
        estado_publicacion_material = data["estado_publicacion_material"]
        latitud_publicacion_material = data["latitud_publicacion_material"]
        longitud_publicacion_material = data["longitud_publicacion_material"]
        descripcion_direccion_material = data["descripcion_direccion_material"] 
        tipo_unidad_material = data["tipo_unidad_material"]
        tipo_material = TipoMaterial.query.get(id_tipo_material)
        if not tipo_material:
            return jsonify({'message': 'Tipo de material no válido'}), 400
        
        
        material.nombre_material = nombre_material
        material.estado_material = estado_material
        material.precio_material = precio_material
        material.descripcion_material = descripcion_material
        material.id_tipo_material = id_tipo_material
        material.cantidad_material = cantidad_material
        material.estado_publicacion_material = estado_publicacion_material
        material.latitud_publicacion_material = latitud_publicacion_material  # Actualizar latitud
        material.longitud_publicacion_material = longitud_publicacion_material  # Actualizar longitud
        material.descripcion_direccion_material = descripcion_direccion_material  # Actualizar descripción de dirección
        material.tipo_unidad_material = tipo_unidad_material
        
        db.session.commit()
        
        return jsonify({'message': 'material actualizado'})     
    except Exception as e:
        db.session.rollback()
        
        return jsonify({
            'message': 'Error al actualizar el material',
            'error': str(e)
        }), 400


@material.route('/api/marcar-inactivo/<int:id>', methods=['PUT'])
def marcar_inactivo(id):
    try:
        # Buscar el material por ID
        material = Material.query.get(id)
        
        if not material:
            return jsonify({'message': 'Material no encontrado'}), 404

        # Cambiar el estado de publicación a "inactivo"
        material.estado_publicacion_material = 'inactivo'
        # Establecer la fecha de terminación a la fecha actual
        material.fecha_terminacion = func.now()

        # Guardar los cambios
        db.session.commit()

        return jsonify({
            'message': 'Material marcado como inactivo exitosamente',
            'data': {
                'id_material': material.id_material,
                'estado_publicacion_material': material.estado_publicacion_material
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': 'Error al cambiar el estado de publicación',
            'error': str(e)
        }), 400


@material.route('/api/marcar-activo/<int:id>', methods=['PUT'])
def marcar_activo(id):
    try:
        # Buscar el material por ID
        material = Material.query.get(id)
        
        if not material:
            return jsonify({'message': 'Material no encontrado'}), 404

        # Cambiar el estado de publicación a "inactivo"
        material.estado_publicacion_material = 'activo'

        # Guardar los cambios
        db.session.commit()

        return jsonify({
            'message': 'Material marcado como activo exitosamente',
            'data': {
                'id_material': material.id_material,
                'estado_publicacion_material': material.estado_publicacion_material
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': 'Error al cambiar el estado de publicación',
            'error': str(e)
        }), 400


@material.route('/api/borrar-material/<int:id>', methods=['DELETE'])
def delete_material(id):
    material = Material.query.get(id)
    if not material:
        return jsonify({'error': 'Material no encontrado'}), 404

    db.session.delete(material)
    db.session.commit()
    return jsonify({'message': 'Material eliminado'}), 200