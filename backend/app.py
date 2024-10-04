import os
from flask import Flask, send_from_directory, jsonify, request, redirect, url_for, flash
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from base64 import b64encode
from flask_cors import CORS
from flask_migrate import Migrate




app = Flask(__name__, static_folder='static', static_url_path='')

CORS(app)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/uploads')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
app.config['SECRET_KEY'] = 'supersecretkey' 
app.config['MAX_CONTENT_LENGTH'] = 5 * 1080 * 1080


#CONEXION PARA PRUEBAS EN PYTHONANYWHERE
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://SyntaxError404:nohayerrores@SyntaxError404.mysql.pythonanywhere-services.com/SyntaxError404$default'

#CONEXION PARA PRUEBAS EN BASE LOCAL
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost:3306/buildify'



# Asegúrate de que el directorio de subida exista
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
app.config['MAX_PHOTOS'] = 10
CORS(app)

db = SQLAlchemy(app)

migrate = Migrate(app,db)


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
    data = db.Column(db.LargeBinary, nullable=False)
  
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
@app.route('/api/RegistrarUsuario', methods=['POST'])
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
        return jsonify({"message": 'Error al iniciar sesión: Usuario o contraseña incorrectos'}), 404
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
        return jsonify({"message": 'Error al iniciar sesión: Usuario o contraseña incorrectos'}), 401


# Ruta para actualizar la zona de trabajo de un usuario
@app.route('/api/usuarios/<int:id_usuario>/zona', methods=['PUT'])
def actualizar_zona(id_usuario):
    data = request.get_json()
    usuario = Usuario.query.get_or_404(id_usuario)
    usuario.zona_trabajo = data.get('zona_trabajo', usuario.zona_trabajo)
    db.session.commit()
    return jsonify({"message": "Zona de trabajo actualizada", "zona_trabajo": usuario.zona_trabajo})

# Ruta para actualizar la imagen de perfil de un usuario
@app.route('/api/usuarios/<int:id_usuario>/imagen', methods=['PUT'])
def actualizar_imagen(id_usuario):
    data = request.get_json()
    usuario = Usuario.query.get_or_404(id_usuario)
    usuario.imagen_perfil = data.get('imagen_perfil', usuario.imagen_perfil)  # Se espera que la imagen esté en Base64
    db.session.commit()
    return jsonify({"message": "Imagen de perfil actualizada"})

# Ruta para actualizar el nombre de usuario
@app.route('/api/usuarios/<int:id_usuario>/nombre', methods=['PUT'])
def actualizar_nombre(id_usuario):
    data = request.get_json()
    usuario = Usuario.query.get_or_404(id_usuario)
    usuario.nombre_usuario = data.get('nombre_usuario', usuario.nombre_usuario)
    db.session.commit()
    return jsonify({"message": "Nombre de usuario actualizado", "nombre_usuario": usuario.nombre_usuario})

# Ruta para actualizar el teléfono de un usuario
@app.route('/api/usuarios/<int:id_usuario>/telefono', methods=['PUT'])
def actualizar_telefono(id_usuario):
    data = request.get_json()
    usuario = Usuario.query.get_or_404(id_usuario)
    usuario.telefono = data.get('telefono', usuario.telefono)
    db.session.commit()
    return jsonify({"message": "Teléfono actualizado", "telefono": usuario.telefono})


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
    
    if len(file) > 10:
        return jsonify({'error': 'Solo se pueden subir hasta 10 fotos'}), 400
    
    if not validar_formato(file.filename):
        return jsonify({'error': 'Formato no valido. Solo se permiten imagenes PNG o JPG'}), 400
    
    img = Image.open(file)
    if img.size != (1080, 1080):
        return jsonify({'error','la imagen debe ser de 1080x1080 pixeles'}), 400
    

    if file:
        file.seek(0)
        filename = secure_filename(file.filename)
        file_data = file.read()

        nueva_foto = Foto(filename=filename, data=file_data)
        db.session.add(nueva_foto)
        db.session.commit()

        flash('Imagen subida correctamente', 'success')
        return jsonify({'success': 'Imagen subida correctamente'}), 200

def validar_formato(filename):
    validar_extension = {'png', 'jpg'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in validar_extension

def mostrar_fotos():
    fotos = Foto.query.all()
    fotos_data = [{'id': foto.id, 'filename': foto.filename, 'data': b64encode(foto.data).decode('utf-8')} for foto in fotos]
    return jsonify({'fotos': fotos_data}), 200

#######################################################################
# el codigo de abajo sirve para poder ejecutar react en python anywhere

@app.route('/', defaults={'path': ''})
@app.route('/<path>')
def serve_react_app(path):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    with app.app_context():
        db.create_all()  
    app.run(debug=True)
