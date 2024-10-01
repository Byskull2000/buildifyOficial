import os
from flask import Flask, send_from_directory, jsonify, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='static', static_url_path='')

# Configuración de la base de datos MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:nilson123@localhost/Fotos'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads'  

# Asegúrate de que el directorio de subida exista
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)

# Modelo de base de datos para las fotos
class Foto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)

# Endpoint de la API
@app.route('/api/integrantes')
def api():
    integrantes = ["Pablo", "Diego", "Jhunior", "Eleonor", "Fernanda", "Bruno", "Jhoel", "Kike", "Nilson"]
    return jsonify({'integrantes': integrantes})

# Ruta para subir fotos
@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part', 400
        
        file = request.files['file']
        
        if file.filename == '':
            return 'No selected file', 400
        
        if file:
            # Guardar el archivo
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            
            # Guardar el nombre del archivo en la base de datos
            nueva_foto = Foto(filename=filename)
            db.session.add(nueva_foto)
            db.session.commit()

            return redirect(url_for('upload_file'))

    return render_template('upload.html')  

# Ruta para mostrar las fotos almacenadas
@app.route('/fotos')
def mostrar_fotos():
    fotos = Foto.query.all()
    return render_template('mostrar_fotos.html', fotos=fotos)

# Código para servir la aplicación React
@app.route('/', defaults={'path': ''})
@app.route('/<path>')
def serve_react_app(path):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Crear la base de datos si no existe
    app.run(debug=True)