from flask import Blueprint, jsonify, request, send_from_directory
from utils.db import db
from models.foto import Foto

react = Blueprint("react", __name__,
                  static_folder='../static', static_url_path='')


@react.route('/api/fotos', methods=['GET'])
def get_fotos():
    return "hola mundo"


@react.route('/', defaults={'path': ''})
@react.route('/<path>')
def serve_react_app(path):
    return send_from_directory(react.static_folder, 'index.html')
