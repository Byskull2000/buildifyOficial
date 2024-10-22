from utils.db import db

# Modelo de base de datos para las fotos


class Foto(db.Model):
    __tablename__ = 'foto'
    id_foto = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)
    data = db.Column(db.LargeBinary, nullable=False)

    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario', ondelete="CASCADE"), nullable=False)
    usuario = db.relationship('Usuario', backref=db.backref('fotos', lazy=True, cascade="all, delete"))

