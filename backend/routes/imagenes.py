import os
from utils.db import db
from flask import current_app,Blueprint,jsonify
from models.imagen import Imagen
imagen = Blueprint("imagen", __name__)

@imagen.route('/api/imagen/limpiar',methods=['GET'])
def limpiar_imagenes():
    try:
        # Ruta de las imágenes en el servidor
        server_image_path = os.path.join(current_app.root_path, "static/image")
        
        # Listar archivos en el servidor
        images_on_server = set(os.listdir(server_image_path))
        
        # Obtener URLs de imágenes desde la base de datos
        images_in_db = set(imagen.url_imagen.split('/')[-1] for imagen in Imagen.query.all())
        
        # 1. Imágenes en la base de datos pero no en el servidor
        missing_on_server = images_in_db - images_on_server
        for filename in missing_on_server:
            # Eliminar referencia en la base de datos
            imagen = Imagen.query.filter(Imagen.url_imagen.like(f"%/{filename}")).first()
            if imagen:
                db.session.delete(imagen)
                print(f"Eliminada referencia de la base de datos: {filename}")
        
        # 2. Imágenes en el servidor pero no en la base de datos
        missing_in_db = images_on_server - images_in_db
        for filename in missing_in_db:
            # Eliminar archivo del servidor
            filepath = os.path.join(server_image_path, filename)
            if os.path.exists(filepath):
                os.remove(filepath)
                print(f"Eliminada imagen del servidor: {filename}")
        
        # Confirmar los cambios en la base de datos
        db.session.commit()
        print("Limpieza de imágenes completada.")
        return jsonify({'message': "Limpieza de imágenes completada correctamente"})
    except Exception as e:
        print(f"Error durante la limpieza de imágenes: {e}")
