import os
from flask import Flask, send_from_directory, jsonify, request, redirect, url_for, flash
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from base64 import b64encode
from PIL import Image
import io
from flask_cors import CORS
from flask_migrate import Migrate
from sqlalchemy.sql import func




app = Flask(__name__, static_folder='static', static_url_path='')


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
    correo_electronico = db.Column(db.String(100), nullable=False, unique=True)
    numero_telefono = db.Column(db.String(25), nullable=False, unique=True)
    contrasenia = db.Column(db.String(50), nullable=False, unique=True)
    fecha_creacion = db.Column(db.DateTime,default=func.now(), nullable=True)
    ultimo_login = db.Column(db.DateTime, nullable=True)
    estado_usuario = db.Column(db.String(15), nullable=True)
    zona_trabajo = db.Column(db.String(50), nullable=True)
    imagen_perfil = db.Column(db.LargeBinary, nullable=True)


# Modelo de base de datos para las fotos
class Foto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(100), nullable=False)
    data = db.Column(db.LargeBinary,nullable=False)
    
  
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
        'numero_telefono': u.numero_telefono,
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
        numero_telefono=data['numero_telefono'],
        fecha_creacion=data.get('fecha_creacion'),
        ultimo_login=data.get('ultimo_login'),      # Puede ser opcional
        estado_usuario=data.get('estado_usuario'),  # Puede ser opcional
        zona_trabajo=data.get('zona_trabajo'),      # Puede ser opcional
        imagen_perfil=data.get('imagen_perfil')     # Puede ser opcional
    )
    try:
        db.session.add(nuevo_usuario)
        db.session.commit()  # Confirmar los cambios en la base de datos
        usuario_creado = {
            "id_usuario": nuevo_usuario.id_usuario,
            "nombre_usuario": nuevo_usuario.nombre_usuario,
            "correo_electronico": nuevo_usuario.correo_electronico,
            "ultimo_login": nuevo_usuario.ultimo_login,
            "estado_usuario": nuevo_usuario.estado_usuario,
            "zona_trabajo": nuevo_usuario.zona_trabajo,
            "imagen_perfil": nuevo_usuario.imagen_perfil,
            "numero_telefono": nuevo_usuario.numero_telefono
        }
        
        return jsonify({"message": "Usuario creado correctamente", "data": usuario_creado}), 201
    except Exception as e:
        print("Error", str(e))
        db.session.rollback()  # Revertir si hay algún error
        
        return jsonify({'error': str(e)}), 400

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
            'numero_telefono': user.numero_telefono,
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
    usuario.numero_telefono = data.get('numero_telefono', usuario.numero_telefono)
    db.session.commit()
    return jsonify({"message": "Teléfono actualizado", "telefono": usuario.numero_telefono})


# Ruta para actualizar el perfil del usuario
@app.route('/api/usuarios/<int:id_usuario>/perfil', methods=['PUT'])
def actualizar_perfil(id_usuario):
    try:
        data = request.get_json()
        
        usuario = Usuario.query.get_or_404(id_usuario)
        print("usuario", usuario)
        
        usuario.nombre_usuario = data['nombre_usuario']
    
        usuario.zona_trabajo = data['zona_trabajo']
    

        usuario.numero_telefono = data['numero_telefono']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Perfil actualizado correctamente',
            'data': {
                'id_usuario': usuario.id_usuario,
                'nombre_usuario': usuario.nombre_usuario,
                'correo_electronico': usuario.correo_electronico,
                'fecha_creacion': usuario.fecha_creacion,
                'ultimo_login': usuario.ultimo_login,
                'estado_usuario': usuario.estado_usuario,
                'numero_telefono': usuario.numero_telefono,
                'zona_trabajo': usuario.zona_trabajo,
                'imagen_perfil': usuario.imagen_perfil.decode('utf-8') if usuario.imagen_perfil else None
            }
        }), 200
    
    except Exception as e:
        print(e)
        # Manejo de errores
        return jsonify({
            'message': 'Error al actualizar el perfil del usuario',
        }), 400



#convertir fotos en binario para almacenar en la BD
@app.template_filter('b64encode')
def b64encode_filter(data):
    if data is None:
        return ""  
    return b64encode(data).decode('utf-8')

# Aqui se pondran los endpoints de las API que se vayan a crear siempre deben empezar con la ruta /api/


def validar_formato(filename):
    validar_extension = {'png', 'jpg'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in validar_extension

# Subir fotos
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No se encontró el archivo en la solicitud. Por favor, selecciona un archivo para subir.'}), 400

    files = request.files.getlist('file')
    if len(files) > app.config['MAX_PHOTOS']:
        return jsonify({'error': 'Has superado el límite de 10 fotos. Por favor, sube menos fotos.'}), 400

    uploaded_files = []
    
    for file in files:
        if file.filename == '':
            return jsonify({'error': 'No has seleccionado ningún archivo. Por favor, selecciona un archivo para continuar.'}), 400
        
        if not validar_formato(file.filename):
            return jsonify({'error': 'Formato no válido. Solo se permiten imágenes PNG o JPG.'}), 400

        try:
            img = Image.open(file)
            img.verify()  # Verifica que el archivo sea una imagen
            if img.size != (1080, 1080):
                return jsonify({'error': 'La imagen debe tener dimensiones de 1080x1080 píxeles.'}), 400
            
            img_bytes = io.BytesIO()
            img.save(img_bytes, format='PNG' if img.format == 'PNG' else 'JPEG')  # Guarda en un formato válido
            img_bytes = img_bytes.getvalue()

            filename = secure_filename(file.filename)
            nueva_foto = Foto(filename=filename, data=img_bytes)
            db.session.add(nueva_foto)
            uploaded_files.append(filename)  # Agregar el nombre del archivo subido a la lista

        except Exception as e:
            return jsonify({'error': f'Error al procesar la imagen "{file.filename}": {str(e)}'}), 400

    db.session.commit()
    return jsonify({'success': f'Imágenes {", ".join(uploaded_files)} subidas correctamente.'}), 200

#galeria de fotos
@app.route('/api/galeria', methods=['GET'])
def mostrar_fotos():
    fotos = Foto.query.all()  # Recupera todas las fotos de la base de datos
    fotos_data = [{'id': foto.id, 'filename': foto.filename, 'data': b64encode(foto.data).decode('utf-8')} for foto in fotos]
    return jsonify({'fotos': fotos_data}), 200

#######################################################################
# el codigo de abajo sirve para poder ejecutar react en python anywhere


#@app.route('/')
#@app.route('/<path:path>')
#def serve_react_app(path=''):
    #if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        #return send_from_directory(app.static_folder, path)
    #else:
        #return send_from_directory(app.static_folder, 'index.html')

@app.route('/', defaults={'path': ''})
@app.route('/<path>')
def serve_react_app(path):
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  
    app.run(debug=True)
