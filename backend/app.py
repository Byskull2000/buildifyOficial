import os
from flask import Flask, send_from_directory, jsonify, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='static', static_url_path='')

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://SyntaxError404:nohayerrores@SyntaxError404.mysql.pythonanywhere-services.com/SyntaxError404$default'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost:3306/buildify'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads' 
app.config['SECRET_KEY'] = 'supersecretkey' 



# Asegúrate de que el directorio de subida exista
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)

# Modelo para la tabla Usuario
class Usuario(db.Model):
    __tablename__ = 'Usuario'
    id_usuario = db.Column(db.Integer, primary_key=True)
    nombre_usuario = db.Column(db.String(80), nullable=False)
    correo_electronico = db.Column(db.String(100), nullable=False)
    contrasenia = db.Column(db.String(50), nullable=False)
    fecha_creacion = db.Column(db.DateTime, nullable=True)
    ultimo_login = db.Column(db.DateTime, nullable=True)
    estado_usuario = db.Column(db.String(15), nullable=True)
    zona_trabajo = db.Column(db.String(50), nullable=True)
    imagen_perfil = db.Column(db.LargeBinary, nullable=True)


# Modelo de base de datos para las fotos
class Foto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)
    
# Ruta para devolver los nombres de los campos de la tabla Usuario
@app.route('/api/usuarios/campos', methods=['GET'])
def obtener_campos_usuario():
    columnas = [column.name for column in Usuario.__table__.columns]
    return jsonify(columnas)

# Ruta para obtener todos los usuarios
@app.route('/api/usuarios', methods=['GET'])
def obtener_usuarios():
    usuarios = Usuario.query.all()  # Obtener todos los usuarios
    return jsonify([{
        'id_usuario': u.id_usuario,
        'nombre_usuario': u.nombre_usuario,
        'correo_electronico': u.correo_electronico,
        'contrasenia': u.contrasenia,
        'fecha_creacion': u.fecha_creacion,
        'ultimo_login': u.ultimo_login,
        'estado_usuario': u.estado_usuario,
        'zona_trabajo': u.zona_trabajo,
        'imagen_perfil': u.imagen_perfil.decode('utf-8') if u.imagen_perfil else None
    } for u in usuarios])  # Devolver como JSON

# Ruta para agregar un nuevo usuario
@app.route('/api/usuarios', methods=['POST'])
def agregar_usuario():
    data = request.get_json()  # Obtener los datos del cuerpo de la petición
    nuevo_usuario = Usuario(
        nombre_usuario=data['nombre_usuario'],
        correo_electronico=data['correo_electronico'],
        contrasenia=data['contrasenia'],
        fecha_creacion=data.get('fecha_creacion'),  # Puede ser opcional
        ultimo_login=data.get('ultimo_login'),      # Puede ser opcional
        estado_usuario=data.get('estado_usuario'),  # Puede ser opcional
        zona_trabajo=data.get('zona_trabajo'),      # Puede ser opcional
        imagen_perfil=data.get('imagen_perfil')     # Puede ser opcional
    )
    db.session.add(nuevo_usuario)  # Agregar el usuario a la sesión
    db.session.commit()              # Confirmar los cambios en la base de datos
    return jsonify({'message': 'Usuario agregado exitosamente', 'id_usuario': nuevo_usuario.id_usuario}), 201

@app.route('/api/login',methods=['POST'])
def login():
    data = request.get_json()
    correo_electronico = data["correo_electronico"]
    contrasenia = data["contrasenia"]
    
    user = Usuario.query.filter_by(correo_electronico=correo_electronico).first()
    
    if not user:
        return jsonify({'message': "Usuario no encontrado"}), 404
    if user.contrasenia == contrasenia: 
        return jsonify({'data': {
            'id_usuario': user.id_usuario,
            'nombre_usuario': user.nombre_usuario,
            'correo_electronico': user.correo_electronico,
            'fecha_creacion': user.fecha_creacion,
            'ultimo_login': user.ultimo_login,
            'estado_usuario': user.estado_usuario,
            'zona_trabajo': user.zona_trabajo,
            'imagen_perfil': user.imagen_perfil.decode('utf-8') if user.imagen_perfil else None
        } 
                    }), 200    
    else:   
        return jsonify({"message": 'Contraseña incorrecta'}), 401


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