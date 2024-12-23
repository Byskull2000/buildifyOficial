from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from utils.db import db

# importacion de modelos para tablas que no tendran rutas
#from models import ubicacion
#from models import interes
#from models import tipo_material
from models import material

# importacion de rutas
from routes.usuarios import usuarios
from routes.fotos import fotos
from routes.static_file import static_file
from routes.ubicaciones import ubicaciones
from routes.direcciones_entrega import direcciones_entrega
from routes.interes import interes
from routes.tipo_material import tipo_material
from routes.material import material
from routes.productos_similares import productos_similares  

app = Flask(__name__)

# zona de agregacion de rutas importadas
app.register_blueprint(usuarios)
app.register_blueprint(fotos)
app.register_blueprint(static_file)
app.register_blueprint(ubicaciones)
app.register_blueprint(direcciones_entrega)  
app.register_blueprint(interes)
app.register_blueprint(tipo_material)
app.register_blueprint(material)
app.register_blueprint(productos_similares) 


# CONEXION PARA PRUEBAS EN PYTHONANYWHERE
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://SyntaxError404:nohayerrores@SyntaxError404.mysql.pythonanywhere-services.com/SyntaxError404$buildify'

# CONEXION PARA PRUEBAS EN BASE LOCAL

#app.config["SQLALCHEMY_DATABASE_URI"] = ("mysql+pymysql://root:root@localhost:3306/buildify")

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
CORS(app)
db.init_app(app)

migrate = Migrate(app, db)
import os

directory = 'static/image'


if not os.path.exists(directory):
    os.makedirs(directory)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)