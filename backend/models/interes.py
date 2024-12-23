from sqlalchemy.sql import func
from utils.db import db

class Interes(db.Model):
    __tablename__ = 'interes'

    id_interes = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fecha_seleccion = db.Column(db.DateTime, default=func.now(), nullable=True)

    id_tipo_material = db.Column(db.Integer, db.ForeignKey('tipo_material.id_tipo_material', ondelete="CASCADE"), nullable=False)
    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario', ondelete="CASCADE"), nullable=False)

    tipo_material = db.relationship('TipoMaterial', backref=db.backref('intereses', lazy=True, cascade="all, delete"))
    usuario = db.relationship('Usuario', backref=db.backref('intereses', lazy=True, cascade="all, delete"))