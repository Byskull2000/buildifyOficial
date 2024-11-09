from utils.db import db

# Modelo de base de datos para las fotos


class Foto(db.Model):
    __tablename__ = 'foto'  
    id = db.Column(db.Integer, primary_key=True)  # Cambiar a 'id' como clave primaria
    filename = db.Column(db.String(100), nullable=False)
    data = db.Column(db.LargeBinary, nullable=False)

    id_material = db.Column(db.Integer, db.ForeignKey('material.id_material', ondelete="CASCADE"), nullable=False)
    material = db.relationship('Material', backref=db.backref('fotos', lazy=True, cascade="all, delete"))

