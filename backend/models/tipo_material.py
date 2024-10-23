from utils.db import db

class TipoMaterial(db.Model):
    __tablename__ = 'tipo_material'

    id_tipo_material = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre_tipo_material = db.Column(db.String(50), nullable=False)
    descripcion_tipo_material = db.Column(db.String(255), nullable=True)
    materiales = db.relationship('Material', backref='tipo', lazy=True)  