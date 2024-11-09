# ESTRUCTURA DE ARCHIVOS FLASK

## routes

aqui se agregaran rutas por cada modelo

### como usar routes ej usuarios ver el archivo routes/usuarios y app

1. crear el archivo en routes
   `routes/usuarios.py`
2. importar Blueprint
   `from flask import Blueprint`
3. crear un blueprint
   `usuarios = Blueprint('api/usuarios',__name__)`
4. crear un route para usuarios
   `@usuarios.route("/")
  def home():
  return "contacts list"
`
5. agregar las routes en app.py
   `app.py`
6. importar las routes creadas de usuarios
   `from routes.usuarios import usuarios`

## utils

aqui se pondran las funciones que necesitan implementar la logica en sus rutas
