from flask import Blueprint, request, jsonify
from models.pedido import Pedido
from utils.db import db

pedido = Blueprint('pedido', __name__)

@pedido.route('/api/registrar-pedido', methods=['POST'])
def registrar_pedido():
    data = request.get_json()

    # Validar los campos requeridos
    campos_requeridos = [
        'estado_pedido', 'metodo_pago', 'total_pedido',
        'nombre_destinatario_pedido', 'descrip_direc_entrega_pedido',
        'telefono_ref_pedido', 'latitud_entrega_pedido', 'longitud_entrega_pedido',
        'precio_unitario_producto', 'id_usuario', 'id_material'
    ]
    for campo in campos_requeridos:
        if campo not in data:
            return jsonify({"message": f"El campo {campo} es obligatorio."}), 400

    try:
        # Crear una nueva instancia del modelo Pedido
        nuevo_pedido = Pedido(
            estado_pedido=data['estado_pedido'],
            metodo_pago=data['metodo_pago'],
            total_pedido=data['total_pedido'],
            nombre_destinatario_pedido=data['nombre_destinatario_pedido'],
            descrip_direc_entrega_pedido=data['descrip_direc_entrega_pedido'],
            telefono_ref_pedido=data['telefono_ref_pedido'],
            latitud_entrega_pedido=data['latitud_entrega_pedido'],
            longitud_entrega_pedido=data['longitud_entrega_pedido'],
            precio_unitario_producto=data['precio_unitario_producto'],
            id_usuario=data['id_usuario'],
            id_material=data['id_material']
        )

        # Guardar el pedido en la base de datos
        db.session.add(nuevo_pedido)
        db.session.commit()

        return jsonify({"message": "Pedido registrado exitosamente"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al registrar el pedido", "error": str(e)}), 500


@pedido.route('/api/pedidos/<int:id_usuario>', methods=['GET'])
def obtener_pedidos_por_usuario(id_usuario):
    try:
        # Consultar pedidos por id_usuario
        pedidos = Pedido.query.filter_by(id_usuario=id_usuario).order_by(Pedido.fecha_pedido.desc()).all()

        if not pedidos:
            return jsonify({"message": "No se encontraron pedidos para el usuario especificado"}), 404

        # Formatear la respuesta con la información de cada pedido
        data = [{
            'id_pedido': pedido.id_pedido,
            'estado_pedido': pedido.estado_pedido,
            'fecha_pedido': pedido.fecha_pedido,
            'metodo_pago': pedido.metodo_pago,
            'total_pedido': pedido.total_pedido,
            'nombre_destinatario_pedido': pedido.nombre_destinatario_pedido,
            'descrip_direc_entrega_pedido': pedido.descrip_direc_entrega_pedido,
            'telefono_ref_pedido': pedido.telefono_ref_pedido,
            'latitud_entrega_pedido': pedido.latitud_entrega_pedido,
            'longitud_entrega_pedido': pedido.longitud_entrega_pedido,
            'precio_unitario_producto': pedido.precio_unitario_producto,
            'id_usuario': pedido.id_usuario,
            'id_material': pedido.id_material
        } for pedido in pedidos]

        return jsonify({"message": "Pedidos obtenidos exitosamente", "data": data}), 200

    except Exception as e:
        return jsonify({"message": "Error al obtener pedidos", "error": str(e)}), 500
