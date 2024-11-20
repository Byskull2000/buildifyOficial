from flask import Blueprint, request, jsonify
from models.material import Material
from models.pedido import Pedido
from utils.db import db

pedido = Blueprint('pedido', __name__)

@pedido.route('/api/registrar-pedido', methods=['POST'])
def registrar_pedido():
    data = request.get_json()

    # Validar los campos requeridos
    campos_requeridos = [
        'metodo_pago', 'total_pedido', 'precio_unitario_producto', 'id_usuario', 'id_material', 'cantidad_producto'
    ]
    for campo in campos_requeridos:
        if campo not in data:
            return jsonify({"message": f"El campo {campo} es obligatorio."}), 400

    try:
        # Crear una nueva instancia del modelo Pedido
        nuevo_pedido = Pedido(
            estado_pedido="Pendiente",
            metodo_pago=data['metodo_pago'],
            total_pedido=data['total_pedido'],
            precio_unitario_producto=data['precio_unitario_producto'],
            id_usuario=data['id_usuario'],
            id_material=data['id_material'],
            cantidad_producto=data['cantidad_producto']
        )

        # Guardar el pedido en la base de datos
        db.session.add(nuevo_pedido)
        db.session.commit()

        return jsonify({"message": "Pedido registrado exitosamente"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al registrar el pedido", "error": str(e)}), 500


@pedido.route('/api/completar-pedido/<int:id_pedido>', methods=['PUT'])
def completar_pedido(id_pedido):
    data = request.get_json()

    # Validar que todos los campos requeridos para completar el pedido estén presentes
    campos_requeridos = [
        'nombre_destinatario_pedido', 'descrip_direc_entrega_pedido',
        'telefono_ref_pedido', 'latitud_entrega_pedido', 'longitud_entrega_pedido'
    ]
    for campo in campos_requeridos:
        if campo not in data:
            return jsonify({"message": f"El campo {campo} es obligatorio."}), 400

    try:
        # Buscar el pedido por id
        pedido = Pedido.query.get(id_pedido)
        if not pedido:
            return jsonify({"message": "Pedido no encontrado"}), 404

        # Actualizar los campos faltantes
        pedido.nombre_destinatario_pedido = data['nombre_destinatario_pedido']
        pedido.descrip_direc_entrega_pedido = data['descrip_direc_entrega_pedido']
        pedido.telefono_ref_pedido = data['telefono_ref_pedido']
        pedido.latitud_entrega_pedido = data['latitud_entrega_pedido']
        pedido.longitud_entrega_pedido = data['longitud_entrega_pedido']
        pedido.estado_pedido = "Entregado"
        

        # Guardar los cambios en la base de datos
        db.session.commit()

        return jsonify({"message": "Pedido completado exitosamente"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al completar el pedido", "error": str(e)}), 500



@pedido.route('/api/pedidos/<int:id_usuario>', methods=['GET'])
def obtener_pedidos_por_usuario(id_usuario):
    try:
        # Consultar pedidos por id_usuario
        pedidos = db.session.query(Pedido, Material).join(Material, Pedido.id_material == Material.id_material).filter(Pedido.id_usuario == id_usuario).order_by(Pedido.fecha_pedido.desc()).all()

        if not pedidos:
            return jsonify({"message": "No se encontraron pedidos para el usuario especificado"}), 404

        # Formatear la respuesta con la información de cada pedido
        data = [{
            'id_pedido': pedido.Pedido.id_pedido,
            'estado_pedido': pedido.Pedido.estado_pedido,
            'fecha_pedido': pedido.Pedido.fecha_pedido,
            'metodo_pago': pedido.Pedido.metodo_pago,
            'total_pedido': pedido.Pedido.total_pedido,
            'nombre_destinatario_pedido': pedido.Pedido.nombre_destinatario_pedido,
            'descrip_direc_entrega_pedido': pedido.Pedido.descrip_direc_entrega_pedido,
            'telefono_ref_pedido': pedido.Pedido.telefono_ref_pedido,
            'latitud_entrega_pedido': pedido.Pedido.latitud_entrega_pedido,
            'longitud_entrega_pedido': pedido.Pedido.longitud_entrega_pedido,
            'precio_unitario_producto': pedido.Pedido.precio_unitario_producto,
            'id_usuario': pedido.Pedido.id_usuario,
            'id_material': pedido.Pedido.id_material,
            # Datos del material
            'material': {
                'id_material': pedido.Material.id_material,
                'nombre_material': pedido.Material.nombre_material,
                'descripcion_material': pedido.Material.descripcion_material,
                'cantidad_material': pedido.Material.cantidad_material,
                'estado_material': pedido.Material.estado_material,
                'precio_material': pedido.Material.precio_material,
                'id_tipo_material': pedido.Material.id_tipo_material,
                'latitud_publicacion_material': pedido.Material.latitud_publicacion_material,
                'longitud_publicacion_material': pedido.Material.longitud_publicacion_material,
                'descripcion_direccion_material': pedido.Material.descripcion_direccion_material,
                'estado_publicacion_material': pedido.Material.estado_publicacion_material,
                'fecha_publicacion': pedido.Material.fecha_publicacion,
                'tipo_unidad_material': pedido.Material.tipo_unidad_material,
                "imagenUrl": (
                    pedido.Material.imagenes[0].url_imagen if pedido.Material.imagenes else None
                ),
                "imagenes": [
                    {"id_imagen": imagen.id_imagen, "url_imagen": imagen.url_imagen}
                    for imagen in pedido.Material.imagenes
                ],
            }
        } for pedido in pedidos]

        return jsonify({"message": "Pedidos obtenidos exitosamente", "data": data}), 200

    except Exception as e:
        return jsonify({"message": "Error al obtener pedidos", "error": str(e)}), 500
