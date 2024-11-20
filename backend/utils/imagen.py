import os
from werkzeug.utils import secure_filename
from flask import request,current_app
from models.imagen import Imagen
from utils.db import db
import uuid

def subir_imagen(foto):
    try:
        if foto.filename == "":
            return None

        filename = secure_filename(foto.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        
        filepath = os.path.join(current_app.static_folder, 'image', unique_filename)

        foto.save(filepath)

        url = f"{request.host_url}static/image/{unique_filename}"
        print(f"Imagen guardada en: {filepath}, URL generada: {url}")

        return url
    except Exception as e:
        print(f"Error al guardar la imagen: {e}")
        return None


def subir_imagenes(fotos):
    try:
        url_imagenes = []
        for foto in fotos:
            url_imagen = subir_imagen(foto)
            if url_imagen:
                url_imagenes.append(url_imagen)
        
        return url_imagenes
    except Exception as e:
        print(f"Error al subir las imágenes: {e}")
        return []
    

def guardar_imagenes(urls, id_material):
    try:
        imagenes = []
        for url in urls:
            imagenes.append(Imagen(url_imagen=url,id_material=id_material))
        return imagenes
        
    except Exception as e:
        print(f"Error al guardar las imágenes en la base de datos: {e}")
        return []

def eliminar_imagenes(ids):
    for id in ids:
        imagen = Imagen.query.get(id)
        url = imagen.url_imagen
        filename = url.split('/')[-1]
        filepath = os.path.join(current_app.root_path,"static/image", filename)
        if os.path.exists(filepath):
            os.remove(filepath)
            db.session.delete(imagen)
            
        print(filepath)
