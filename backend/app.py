import os
from flask import Flask, send_from_directory, jsonify, request, redirect, url_for, flash
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from base64 import b64encode


app = Flask(__name__, static_folder='static', static_url_path='')

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://SyntaxError404:nohayerrores@SyntaxError404.mysql.pythonanywhere-services.com/jhoelcamacho$buildify'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/uploads')

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
app.config['MAX_PHOTOS'] = 10
CORS(app)

db = SQLAlchemy(app)

@app.template_filter('b64encode')  #convertir a binario las fotos
def b64encode_filter(data):
    if data is None:
        return ""  
    return b64encode(data).decode('utf-8')

# Aqui se pondran los endpoints de las API que se vayan a crear siempre deben empezar con la ruta /api/
@app.route('/api/integrantes')
def api():
    integrantes = ["Pablo, Diego, Jhunior, Eleonor,Fernanda","Bruno","Jhoel","Kike","Nilson"]
    return jsonify({'integrantes':integrantes})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        flash('No hay archivo en la solicitud', 'error')
        return jsonify({'error': 'No hay archivo en la solicitud'}), 400

    file = request.files['file']
    if file.filename == '':
        flash('No se ha seleccionado ningún archivo', 'error')
        return jsonify({'error': 'No se ha seleccionado ningún archivo'}), 400

    if file:
        filename = secure_filename(file.filename)
        file_data = file.read()

        nueva_foto = Foto(filename=filename, data=file_data)
        db.session.add(nueva_foto)
        db.session.commit()

        flash('Imagen subida correctamente', 'success')
        return jsonify({'success': 'Imagen subida correctamente'}), 200

def mostrar_fotos():
    fotos = Foto.query.all()
    fotos_data = [{'id': foto.id, 'filename': foto.filename, 'data': b64encode(foto.data).decode('utf-8')} for foto in fotos]
    return jsonify({'fotos': fotos_data}), 200

#######################################################################
# el codigo de abajo sirve para poder ejecutar react en python anywhere

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'app.tsx')

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  
    app.run(debug=True)
