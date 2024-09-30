from flask import Flask, send_from_directory, jsonify

app = Flask(__name__, static_folder='static', static_url_path='')

# Aqui se pondran los endpoints de las API que se vayan a crear siempre deben empezar con la ruta /api/
@app.route('/api/integrantes')
def api():
    integrantes = ["Pablo, Diego, Jhunior, Eleonor,Fernanda","Bruno","Jhoel","Kike","Nilson"]
    return jsonify({'integrantes':integrantes})


#######################################################################
# el codigo de abajo sirve para poder ejecutar react en python anywhere

@app.route('/', defaults={'path': ''})
@app.route('/<path>')
def serve_react_app(path):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run()
