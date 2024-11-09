from utils.db import db

# Modelo de base de datos para las ubicaciones


class Ubicacion(db.Model):
    __tablename__ = "ubicacion"
    id_ubicacion = db.Column(db.Integer, primary_key=True)
    latitud = db.Column(db.String(50), nullable=False)
    longitud = db.Column(db.String(50), nullable=False)
    descripcion_ubicacion = db.Column(db.String(50), nullable=True)

    def __init__(self, latitud, longitud, descripcion_ubicacion):
        self.latitud = latitud
        self.longitud = longitud
        self.descripcion_ubicacion = descripcion_ubicacion
