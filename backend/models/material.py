from utils.db import db

class Material(db.Model):
    __tablename__= 'material'
    id_material = db.Column(db.Integer, primary_key=True)
    nombre_material = db.Column(db.String(100), nullable=False)
    cantidad_material = db.Column(db.Integer, nullable=False)
    estado_material = db.Column(db.String(20), nullable=False)
    precio_material = db.Column(db.String(30), nullable=False)
    descripcion_material = db.Column(db.String(255), nullable=True)

    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario', ondelete="CASCADE"), nullable=False)
    id_tipo_material = db.Column(db.Integer, db.ForeignKey('tipo_material.id_tipo_material', ondelete="CASCADE"), nullable=False)

    usuario = db.relationship('Usuario', backref=db.backref('materiales', lazy=True, cascade="all, delete"))
    tipo_material = db.relationship('TipoMaterial', backref=db.backref('materiales', lazy=True, cascade="all, delete"))
