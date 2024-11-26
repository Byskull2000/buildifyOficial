import os
from flask import Blueprint, jsonify, request
from utils.db import db
from models.usuario import Usuario
from sqlalchemy.exc import IntegrityError
from werkzeug.utils import secure_filename
from utils.imagen import subir_imagen

usuarios = Blueprint("usuarios", __name__, static_folder='../static')


from flask import request, jsonify
from werkzeug.utils import secure_filename
import os
from utils.db import db

@usuarios.route("/api/usuarios/<int:id_usuario>/perfil", methods=["PUT"])
def actualizar_perfil(id_usuario):
    try:
        usuario = Usuario.query.get_or_404(id_usuario)
        
        nombre_usuario = request.form.get("nombre_usuario")
        if nombre_usuario:
            usuario.nombre_usuario = nombre_usuario

        zona_trabajo = request.form.get("zona_trabajo")
        if zona_trabajo:
            usuario.zona_trabajo = zona_trabajo

        numero_telefono = request.form.get("numero_telefono")
        if numero_telefono:
            usuario.numero_telefono = numero_telefono

        if "imagen_perfil" in request.files:
            imagen_perfil = request.files["imagen_perfil"]
            if imagen_perfil.filename != "":
                filename = secure_filename(imagen_perfil.filename)
                filepath = os.path.join(usuarios.static_folder, 'image', filename)
                imagen_perfil.save(filepath)
                usuario.imagen_perfil = f"{request.host_url}static/image/{filename}"

        if "imagen_qr" in request.files:
            imagen_qr = request.files["imagen_qr"]
            if imagen_qr.filename != "":
                url = subir_imagen(imagen_qr)
                usuario.imagen_qr = url

        db.session.commit()

        return jsonify({
            "message": "Perfil actualizado correctamente",
            "data": {
                "id_usuario": usuario.id_usuario,
                "nombre_usuario": usuario.nombre_usuario,
                "correo_electronico": usuario.correo_electronico,
                "fecha_creacion": usuario.fecha_creacion,
                "ultimo_login": usuario.ultimo_login,
                "estado_usuario": usuario.estado_usuario,
                "numero_telefono": usuario.numero_telefono,
                "zona_trabajo": usuario.zona_trabajo,
                "imagen_perfil": usuario.imagen_perfil,
                "imagen_qr": usuario.imagen_qr,
            }
        }), 200

    except Exception as e:
        # Manejo de errores
        print("Error al actualizar:", e)
        return jsonify({
            "message": "Error al actualizar el perfil del usuario",
            "error": str(e),
        }), 400


# Ruta para devolver los nombres de los campos de la tabla Usuario
@usuarios.route("/api/usuarios/campos", methods=["GET"])
def obtener_campos_usuario():
    columnas = [column.name for column in Usuario.__table__.columns]
    return jsonify(columnas)

    # Ruta para obtener todos los usuarios


@usuarios.route("/api/usuarios", methods=["GET"])
def obtener_usuarios():
    usuarios = Usuario.query.all()  # Obtener todos los usuarios
    return jsonify(
        [
            {
                "id_usuario": u.id_usuario,
                "nombre_usuario": u.nombre_usuario,
                "correo_electronico": u.correo_electronico,
                "numero_telefono": u.numero_telefono,
                "fecha_creacion": u.fecha_creacion,
                "ultimo_login": u.ultimo_login,
                "estado_usuario": u.estado_usuario,
                "zona_trabajo": u.zona_trabajo,
                "imagen_perfil": u.imagen_perfil,
                "imagen_qr": u.imagen_qr,
            }
            for u in usuarios
        ]
    )  # Devolver como JSON

# Ruta para obtener un usuario por su id
@usuarios.route("/api/usuarios/<int:id_usuario>", methods=["GET"])
def obtener_usuario(id_usuario):
    try:
        usuario = Usuario.query.get_or_404(id_usuario)
        return jsonify({
            "id_usuario": usuario.id_usuario,
            "nombre_usuario": usuario.nombre_usuario,
            "correo_electronico": usuario.correo_electronico,
            "numero_telefono": usuario.numero_telefono,
            "fecha_creacion": usuario.fecha_creacion,
            "ultimo_login": usuario.ultimo_login,
            "estado_usuario": usuario.estado_usuario,
            "zona_trabajo": usuario.zona_trabajo,
            "imagen_perfil": usuario.imagen_perfil,
            "imagen_qr": usuario.imagen_qr,
        }), 200
    except Exception as e:
        return jsonify({
            "message": "Error al obtener los datos del usuario",
            "error": str(e),
        }), 400



# Ruta para agregar un nuevo usuario


@usuarios.route("/api/RegistrarUsuario", methods=["POST"])
def agregar_usuario():
    data = request.get_json()  # Obtener los datos del cuerpo de la petición
    nuevo_usuario = Usuario(
        nombre_usuario=data["nombre_usuario"],
        correo_electronico=data["correo_electronico"],
        contrasenia=data["contrasenia"],
        numero_telefono=data["numero_telefono"],
        fecha_creacion=data.get("fecha_creacion"),
        ultimo_login=data.get("ultimo_login"),  # Puede ser opcional
        estado_usuario=data.get("estado_usuario"),  # Puede ser opcional
        zona_trabajo=data.get("zona_trabajo"),  # Puede ser opcional
        imagen_perfil=data.get("imagen_perfil"),  # Puede ser opcional
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
            "numero_telefono": nuevo_usuario.numero_telefono,
            "imagen_qr": nuevo_usuario.imagen_qr,
        }

        return (
            jsonify(
                {"message": "Usuario creado correctamente", "data": usuario_creado}
            ),
            201,
        )
    except IntegrityError as e:
        db.session.rollback()
        print(str(e))
        if "usuario.correo_electronico" in str(e):
            return jsonify({"message": "Correo electrónico ya registrado"}), 400
        elif "usuario.numero_telefono" in str(e):
            return jsonify({"message": "Número de teléfono ya registrado"}), 400

        return jsonify({"message": "Error con la integridad en la base de datos"}), 400
    except Exception as e:
        print("Error", str(e))
        db.session.rollback()  # Revertir si hay algún error

        return jsonify({"error": str(e)}), 400


@usuarios.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    correo_electronico = data["correo_electronico"]
    contrasenia = data["contrasenia"]

    user = Usuario.query.filter_by(correo_electronico=correo_electronico).first()

    if not user:
        return (
            jsonify(
                {"message": "Error al iniciar sesión: Usuario o contraseña incorrectos"}
            ),
            404,
        )
    if user.contrasenia == contrasenia:
        return (
            jsonify(
                {
                    "data": {
                        "id_usuario": user.id_usuario,
                        "nombre_usuario": user.nombre_usuario,
                        "correo_electronico": user.correo_electronico,
                        "fecha_creacion": user.fecha_creacion,
                        "ultimo_login": user.ultimo_login,
                        "estado_usuario": user.estado_usuario,
                        "numero_telefono": user.numero_telefono,
                        "zona_trabajo": user.zona_trabajo,
                        "imagen_perfil": user.imagen_perfil,
                        "imagen_qr": user.imagen_qr,
                    }
                }
            ),
            200,
        )
    else:
        return (
            jsonify(
                {"message": "Error al iniciar sesión: Usuario o contraseña incorrectos"}
            ),
            401,
        )


# Ruta para actualizar la zona de trabajo de un usuario
@usuarios.route("/api/usuarios/<int:id_usuario>/zona", methods=["PUT"])
def actualizar_zona(id_usuario):
    data = request.get_json()
    usuario = Usuario.query.get_or_404(id_usuario)
    usuario.zona_trabajo = data.get("zona_trabajo", usuario.zona_trabajo)
    db.session.commit()
    return jsonify(
        {"message": "Zona de trabajo actualizada", "zona_trabajo": usuario.zona_trabajo}
    )


# Ruta para actualizar la imagen de perfil de un usuario


@usuarios.route("/api/usuarios/<int:id_usuario>/imagen", methods=["PUT"])
def actualizar_imagen(id_usuario):
    data = request.get_json()
    usuario = Usuario.query.get_or_404(id_usuario)
    # Se espera que la imagen esté en Base64
    usuario.imagen_perfil = data.get("imagen_perfil", usuario.imagen_perfil)
    db.session.commit()
    return jsonify({"message": "Imagen de perfil actualizada"})


# Ruta para actualizar el nombre de usuario


@usuarios.route("/api/usuarios/<int:id_usuario>/nombre", methods=["PUT"])
def actualizar_nombre(id_usuario):
    data = request.get_json()
    usuario = Usuario.query.get_or_404(id_usuario)
    usuario.nombre_usuario = data.get("nombre_usuario", usuario.nombre_usuario)
    db.session.commit()
    return jsonify(
        {
            "message": "Nombre de usuario actualizado",
            "nombre_usuario": usuario.nombre_usuario,
        }
    )


# Ruta para actualizar el teléfono de un usuario
@usuarios.route("/api/usuarios/<int:id_usuario>/telefono", methods=["PUT"])
def actualizar_telefono(id_usuario):
    data = request.get_json()
    usuario = Usuario.query.get_or_404(id_usuario)
    usuario.numero_telefono = data.get("numero_telefono", usuario.numero_telefono)
    db.session.commit()
    
    return jsonify(
        {"message": "Teléfono actualizado", "telefono": usuario.numero_telefono}
    )

@usuarios.route("/api/usuarios/<int:id_usuario>/qr", methods=["GET"])
def obtener_qr_usuario(id_usuario):
    """
    Retorna el QR asociado a un usuario
    """
    try:
        usuario = Usuario.query.get_or_404(id_usuario)
        return jsonify({"imagen_qr": usuario.imagen_qr}), 200
    except Exception as e:
        return jsonify({"error": f"Error al obtener el QR: {str(e)}"}), 500
