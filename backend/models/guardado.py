from utils.db import db
from sqlalchemy.sql import func

class Guardado(db.Model):
    __tablename__= 'guardado'
    id_guardado = db.Column(db.Integer, primary_key=True)
    fecha_guardado = db.Column(db.DateTime, default=func.now(), nullable=False)

    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario', ondelete="CASCADE"), nullable=False)
    id_material = db.Column(db.Integer, db.ForeignKey('material.id_material', ondelete="CASCADE"), nullable=False)

    guardado_usuario = db.relationship('Usuario', backref=db.backref('guardados_usuario', lazy=True))
    guardado_mat = db.relationship('Material', backref=db.backref('guardados_mat', lazy=True))
