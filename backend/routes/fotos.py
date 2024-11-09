from PIL import Image
from flask import Blueprint, jsonify, request
from utils.db import db
from models.foto import Foto
from base64 import b64encode
from werkzeug.utils import secure_filename
from models.material import Material
import io
from utils.image_helpers import validar_formato

MAX_PHOTOS = 10

fotos = Blueprint("fotos", __name__)

# Subir fotos


@fotos.route("/api/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No se encontró el archivo en la solicitud. Por favor, selecciona un archivo para subir."}), 400

    # Verificar que se haya proporcionado un id_material
    id_material = request.form.get("id_material")
    if not id_material:
        return jsonify({"error": "No se proporcionó el id_material para asociar las fotos."}), 400

    # Asegurar que id_material es un entero
    try:
        id_material = int(id_material)
    except ValueError:
        return jsonify({"error": "El id_material proporcionado no es válido."}), 400

    # Verificar que el material existe en la base de datos
    material = Material.query.get(id_material)
    if not material:
        return jsonify({"error": f"No se encontró un material con id {id_material}."}), 404

    files = request.files.getlist("file")
    if len(files) > MAX_PHOTOS:
        return jsonify({"error": "Has superado el límite de 10 fotos. Por favor, sube menos fotos."}), 400

    uploaded_files = []

    for file in files:
        if file.filename == "":
            return jsonify({"error": "No has seleccionado ningún archivo. Por favor, selecciona un archivo para continuar."}), 400

        if not validar_formato(file.filename):
            return jsonify({"error": "Formato no válido. Solo se permiten imágenes PNG o JPG."}), 400

        try:
            img = Image.open(file)
            img.verify()  # Verifica que el archivo sea una imagen
            
            file.seek(0)
            img = Image.open(file)
            img_bytes = io.BytesIO()
            img.save(img_bytes, format="PNG" if img.format == "PNG" else "JPEG")
            img_bytes = img_bytes.getvalue()

            filename = secure_filename(file.filename)
            nueva_foto = Foto(filename=filename, data=img_bytes, id_material=id_material)  # Asociar id_material
            db.session.add(nueva_foto)
            uploaded_files.append(filename)

        except Exception as e:
            print(str(e))
            return jsonify({"error": f'Error al procesar la imagen "{file.filename}": {str(e)}'}), 400

    db.session.commit()
    return jsonify({"success": f'Imágenes {", ".join(uploaded_files)} subidas correctamente.'}), 200


# galeria de fotos


@fotos.route("/api/galeria", methods=["GET"])
def mostrar_fotos():
    fotos = Foto.query.all()  # Recupera todas las fotos de la base de datos
    fotos_data = [
        {
            "id": foto.id,
            "filename": foto.filename,
            "data": b64encode(foto.data).decode("utf-8"),
        }
        for foto in fotos
    ]
    return jsonify({"fotos": fotos_data}), 200
