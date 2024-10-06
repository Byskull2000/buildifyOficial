from flask import Blueprint, jsonify, request
from utils.db import db
from models.usuario import Usuario

usuarios = Blueprint('usuarios', __name__)
# Ruta para actualizar el perfil del usuario


@usuarios.route("/api/<int:id_usuario>/perfil", methods=["PUT"])
def actualizar_perfil(id_usuario):
    try:
        data = request.get_json()

        usuario = Usuario.query.get_or_404(id_usuario)
        print("usuario", usuario)

        usuario.nombre_usuario = data['nombre_usuario']

        usuario.zona_trabajo = data['zona_trabajo']

        usuario.numero_telefono = data['numero_telefono']

        db.session.commit()

        return jsonify({
            'message': 'Perfil actualizado correctamente',
            'data': {
                'id_usuario': usuario.id_usuario,
                'nombre_usuario': usuario.nombre_usuario,
                'correo_electronico': usuario.correo_electronico,
                'fecha_creacion': usuario.fecha_creacion,
                'ultimo_login': usuario.ultimo_login,
                'estado_usuario': usuario.estado_usuario,
                'numero_telefono': usuario.numero_telefono,
                'zona_trabajo': usuario.zona_trabajo,
                'imagen_perfil': usuario.imagen_perfil.decode('utf-8') if usuario.imagen_perfil else None
            }
        }), 200

    except Exception as e:
        print(e)
        # Manejo de errores
        return jsonify({
            'message': 'Error al actualizar el perfil del usuario',
        }), 400


# Ruta para devolver los nombres de los campos de la tabla Usuario
@usuarios.route('/api/usuarios/campos', methods=['GET'])
def obtener_campos_usuario():
    columnas = [column.name for column in Usuario.__table__.columns]
    return jsonify(columnas)

# Ruta para obtener todos los usuarios


@usuarios.route('/api/usuarios', methods=['GET'])
def obtener_usuarios():
    usuarios = Usuario.query.all()  # Obtener todos los usuarios
    return jsonify([{
        'id_usuario': u.id_usuario,
        'nombre_usuario': u.nombre_usuario,
        'correo_electronico': u.correo_electronico,
        'numero_telefono': u.numero_telefono,
        'fecha_creacion': u.fecha_creacion,
        'ultimo_login': u.ultimo_login,
        'estado_usuario': u.estado_usuario,
        'zona_trabajo': u.zona_trabajo,
        'imagen_perfil': u.imagen_perfil.decode('utf-8') if u.imagen_perfil else None
    } for u in usuarios])  # Devolver como JSON

# Ruta para agregar un nuevo usuario


@usuarios.route('/api/RegistrarUsuario', methods=['POST'])
def agregar_usuario():
    data = request.get_json()  # Obtener los datos del cuerpo de la petición
    nuevo_usuario = Usuario(
        nombre_usuario=data['nombre_usuario'],
        correo_electronico=data['correo_electronico'],
        contrasenia=data['contrasenia'],
        numero_telefono=data['numero_telefono'],
        fecha_creacion=data.get('fecha_creacion'),
        ultimo_login=data.get('ultimo_login'),      # Puede ser opcional
        estado_usuario=data.get('estado_usuario'),  # Puede ser opcional
        zona_trabajo=data.get('zona_trabajo'),      # Puede ser opcional
        imagen_perfil=data.get('imagen_perfil')     # Puede ser opcional
    )
    try:
        db.session.add(nuevo_usuario)
        db.session.commit()  # Confirmar los cambios en la base de datos
        usuario_creado = {
            "id_usuario": nuevo_usuario.id_usuario,
            "nombre_usuario": nuevo_usuario.nombre_usuario,
            "correo_electronico": nuevo_usuario.correo_electronico,
            "ultimo_login": nuevo_usuario.ultimo_login,
            "estado_usuario": nuevo_usuario.estado_usuario,
            "zona_trabajo": nuevo_usuario.zona_trabajo,
            "imagen_perfil": nuevo_usuario.imagen_perfil,
            "numero_telefono": nuevo_usuario.numero_telefono
        }

        return jsonify({"message": "Usuario creado correctamente", "data": usuario_creado}), 201
    except Exception as e:
        print("Error", str(e))
        db.session.rollback()  # Revertir si hay algún error

        return jsonify({'error': str(e)}), 400


@usuarios.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    correo_electronico = data["correo_electronico"]
    contrasenia = data["contrasenia"]

    user = Usuario.query.filter_by(
        correo_electronico=correo_electronico).first()

    if not user:
        return jsonify({"message": 'Error al iniciar sesión: Usuario o contraseña incorrectos'}), 404
    if user.contrasenia == contrasenia:
        return jsonify({'data': {
            'id_usuario': user.id_usuario,
            'nombre_usuario': user.nombre_usuario,
            'correo_electronico': user.correo_electronico,
            'fecha_creacion': user.fecha_creacion,
            'ultimo_login': user.ultimo_login,
            'estado_usuario': user.estado_usuario,
            'numero_telefono': user.numero_telefono,
            'zona_trabajo': user.zona_trabajo,
            'imagen_perfil': user.imagen_perfil.decode('utf-8') if user.imagen_perfil else None
        }
        }), 200
    else:
        return jsonify({"message": 'Error al iniciar sesión: Usuario o contraseña incorrectos'}), 401


# Ruta para actualizar la zona de trabajo de un usuario
@usuarios.route('/api/usuarios/<int:id_usuario>/zona', methods=['PUT'])
def actualizar_zona(id_usuario):
    data = request.get_json()
    usuario = Usuario.query.get_or_404(id_usuario)
    usuario.zona_trabajo = data.get('zona_trabajo', usuario.zona_trabajo)
    db.session.commit()
    return jsonify({"message": "Zona de trabajo actualizada", "zona_trabajo": usuario.zona_trabajo})

# Ruta para actualizar la imagen de perfil de un usuario


@usuarios.route('/api/usuarios/<int:id_usuario>/imagen', methods=['PUT'])
def actualizar_imagen(id_usuario):
    data = request.get_json()
    usuario = Usuario.query.get_or_404(id_usuario)
    # Se espera que la imagen esté en Base64
    usuario.imagen_perfil = data.get('imagen_perfil', usuario.imagen_perfil)
    db.session.commit()
    return jsonify({"message": "Imagen de perfil actualizada"})

# Ruta para actualizar el nombre de usuario


@usuarios.route('/api/usuarios/<int:id_usuario>/nombre', methods=['PUT'])
def actualizar_nombre(id_usuario):
    data = request.get_json()
    usuario = Usuario.query.get_or_404(id_usuario)
    usuario.nombre_usuario = data.get('nombre_usuario', usuario.nombre_usuario)
    db.session.commit()
    return jsonify({"message": "Nombre de usuario actualizado", "nombre_usuario": usuario.nombre_usuario})

# Ruta para actualizar el teléfono de un usuario


@usuarios.route('/api/usuarios/<int:id_usuario>/telefono', methods=['PUT'])
def actualizar_telefono(id_usuario):
    data = request.get_json()
    usuario = Usuario.query.get_or_404(id_usuario)
    usuario.numero_telefono = data.get(
        'numero_telefono', usuario.numero_telefono)
    db.session.commit()
    return jsonify({"message": "Teléfono actualizado", "telefono": usuario.numero_telefono})
