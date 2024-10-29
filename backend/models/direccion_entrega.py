from utils.db import db
from datetime import datetime

class DireccionEntrega(db.Model):
    __tablename__ = 'direccion_entrega'

    id_direccion_entrega = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre_destinatario = db.Column(db.String(100), nullable=False)
    descrip_direc_entrega = db.Column(db.String(255), nullable=False)
    telefono = db.Column(db.String(30), nullable=False)
    latitud_entrega = db.Column(db.String(50), nullable=True)
    longitud_entrega = db.Column(db.String(50), nullable=True)
    fecha_registro_entrega = db.Column(db.DateTime, default=datetime.utcnow)

    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario', ondelete="CASCADE"), nullable=False)
    usuario = db.relationship('Usuario', backref=db.backref('direcciones_entrega', lazy=True, cascade="all, delete"))

    def __init__(self, nombre_destinatario, descrip_direc_entrega, telefono, latitud_entrega, longitud_entrega, id_usuario):
        self.nombre_destinatario = nombre_destinatario
        self.descrip_direc_entrega = descrip_direc_entrega
        self.telefono = telefono
        self.latitud_entrega = latitud_entrega
        self.longitud_entrega = longitud_entrega
        self.id_usuario = id_usuario