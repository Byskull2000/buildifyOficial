from utils.db import db
from sqlalchemy.sql import func

class Pedido(db.Model):
    __tablename__= 'pedido'
    id_pedido = db.Column(db.Integer, primary_key=True)
    estado_pedido = db.Column(db.String(20), nullable=False)
    fecha_pedido = db.Column(db.DateTime, default=func.now(), nullable=False)
    metodo_pago = db.Column(db.String(30), nullable=False)
    total_pedido = db.Column(db.Numeric(10, 2), nullable=False)
    nombre_destinatario_pedido = db.Column(db.String(30), nullable=True)
    descrip_direc_entrega_pedido = db.Column(db.String(255), nullable=True)
    telefono_ref_pedido = db.Column(db.String(20), nullable=True)
    latitud_entrega_pedido = db.Column(db.String(50), nullable=True)
    longitud_entrega_pedido = db.Column(db.String(50), nullable=True)
    precio_unitario_producto = db.Column(db.Numeric(10, 2), nullable=False)
    cantidad_producto = db.Column(db.Numeric(10, 2), nullable=False)

    id_usuario = db.Column(db.Integer, db.ForeignKey('usuario.id_usuario', ondelete="CASCADE"), nullable=False)
    id_material = db.Column(db.Integer, db.ForeignKey('material.id_material', ondelete="CASCADE"), nullable=False)

    pedido_usuario = db.relationship('Usuario', backref=db.backref('pedidos_usuario', lazy=True))
    pedido_mat = db.relationship('Material', backref=db.backref('pedidos_material', lazy=True))
