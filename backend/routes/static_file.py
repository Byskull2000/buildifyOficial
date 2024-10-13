from flask import Blueprint, jsonify, request, send_from_directory

static_file = Blueprint("static_file", __name__,
                  static_folder='../static', static_url_path='')


@static_file.route('/api/fotos/<filename>', methods=['GET'])
def  obtener_fotos(filename):
    try:
        print(static_file.static_folder,f'image/{filename}')
        return send_from_directory(static_file.static_folder, f'image/{filename}')
    except FileNotFoundError:
        return jsonify({'message': 'Archivo no encontrado'}), 404


@static_file.route('/', defaults={'path': ''})
@static_file.route('/<path>')
def serve_static_file_app(path):
    return send_from_directory(static_file.static_folder, 'index.html')
