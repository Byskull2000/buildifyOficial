from utils.db import db
from datetime import datetime

class DireccionEntrega(db.Model):
    __tablename__ = 'Direccion_Entrega'

    id_direccionEntrega = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre_destinatario = db.Column(db.String(100), nullable=False)
    descrip_direcEntrega = db.Column(db.String(255), nullable=False)
<<<<<<< HEAD
    telefono = db.Column(db.String(30), nullable=False)
=======
    telefono = db.Column(db.String(15), nullable=False)
>>>>>>> ac01f1f4fc05a5f3cd580abeb6d11c105b6f9f8b
    latitud_entrega = db.Column(db.String(50), nullable=True)
    longitud_entrega = db.Column(db.String(50), nullable=True)
    fecha_registro_entrega = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, nombre_destinatario, descrip_direcEntrega, telefono, latitud_entrega, longitud_entrega):
        self.nombre_destinatario = nombre_destinatario
        self.descrip_direcEntrega = descrip_direcEntrega
        self.telefono = telefono
        self.latitud_entrega = latitud_entrega
        self.longitud_entrega = longitud_entrega
