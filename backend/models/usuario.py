from utils.db import db
from sqlalchemy.sql import func

# Modelo para la tabla Usuario


class Usuario(db.Model):
    __tablename__ = "usuario"
    id_usuario = db.Column(db.Integer, primary_key=True)
    nombre_usuario = db.Column(db.String(80), nullable=False)
    correo_electronico = db.Column(db.String(100), nullable=False, unique=True)
    numero_telefono = db.Column(db.String(20), nullable=False, unique=True)
    contrasenia = db.Column(db.String(50), nullable=False)
    fecha_creacion = db.Column(db.DateTime, default=func.now(), nullable=True)
    ultimo_login = db.Column(db.DateTime, nullable=True)
    estado_usuario = db.Column(db.String(15), nullable=True)
    zona_trabajo = db.Column(db.String(50), nullable=True)
    imagen_perfil = db.Column(db.String(255), nullable=True)

    def __init__(
        self,
        nombre_usuario=None,
        correo_electronico=None,
        numero_telefono=None,
        contrasenia=None,
        ultimo_login=None,
        estado_usuario=None,
        zona_trabajo=None,
        imagen_perfil=None,
        fecha_creacion=None,
    ):
        self.nombre_usuario = nombre_usuario
        self.correo_electronico = correo_electronico
        self.numero_telefono = numero_telefono
        self.contrasenia = contrasenia
        self.ultimo_login = ultimo_login
        self.estado_usuario = estado_usuario
        self.zona_trabajo = zona_trabajo
        self.imagen_perfil = imagen_perfil
        self.fecha_creacion = fecha_creacion
