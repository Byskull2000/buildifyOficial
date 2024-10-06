from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from utils.db import db

# importacion de rutas
from routes.usuarios import usuarios
from routes.fotos import fotos
from routes.react import react

app = Flask(__name__)

# zona de agregacion de rutas importadas
app.register_blueprint(usuarios)
app.register_blueprint(fotos)
app.register_blueprint(react)

# CONEXION PARA PRUEBAS EN PYTHONANYWHERE
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://SyntaxError404:nohayerrores@SyntaxError404.mysql.pythonanywhere-services.com/SyntaxError404$default'

# CONEXION PARA PRUEBAS EN BASE LOCAL
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost:3306/buildify'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db.init_app(app)

migrate = Migrate(app, db)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
