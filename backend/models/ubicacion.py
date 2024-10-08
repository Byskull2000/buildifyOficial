from utils.db import db

# Modelo de base de datos para las ubicaciones

class Ubicacion(db.Model):
    id_ubicacion = db.Column(db.Integer, primary_key=True)
    latitud = db.Column(db.String(50), nullable=False)
    longitud = db.Column(db.String(50), nullable=False)
    Descripcion_ubicacion = db.Column(db.String(50), nullable=True)

    def __init__(self, latitud, longitud, Descripcion_ubicacion):
        self.latitud = latitud
        self.longitud = longitud
        self.Descripcion_ubicacion = Descripcion_ubicacion
