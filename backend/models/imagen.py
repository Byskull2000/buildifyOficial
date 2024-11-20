from sqlalchemy.sql import func
from utils.db import db
import sqlalchemy as sql

class Imagen(db.Model):
    __tablename__ = "imagen"
    id_imagen = db.Column(sql.Integer, primary_key=True, autoincrement=True)
    id_material = db.Column(db.Integer, db.ForeignKey('material.id_material', ondelete="CASCADE"), nullable=False)
    url_imagen = db.Column(sql.String(255), nullable=False) 
    imagen = db.relationship('Material', backref=db.backref('imagenes', lazy=True))
    