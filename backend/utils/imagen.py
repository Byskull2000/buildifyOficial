import os
from werkzeug.utils import secure_filename
from flask import request,current_app

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
