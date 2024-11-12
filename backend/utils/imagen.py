import os
from werkzeug.utils import secure_filename
from flask import request,current_app
from models.imagen import Imagen

# funcion que recibe un archivo foto 
def subir_imagen(foto):
    try:
        if (foto.filename == ""):
            return None
        
        filename = secure_filename(foto.filename)
        filepath = os.path.join(current_app.root_path,"static/image", filename)
        #print(f"Guardando imagen en: {filepath}")  # Log para depuración
        foto.save(filepath)
        #print(f"Imagen guardada en: {filepath}")
        
        return f"{request.host_url}/api/fotos/{filename}"
    except Exception as e:
        print(f"Guardar la imagen: {e}")
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