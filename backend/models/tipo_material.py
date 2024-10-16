from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class TipoMaterial(db.Model):
    __tablename__ = 'Tipo_Material'

    id_tipoMaterial = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre_tipo_material = db.Column(db.String(50), nullable=False)
    descripcion_tipoMaterial = db.Column(db.String(255), nullable=True)

