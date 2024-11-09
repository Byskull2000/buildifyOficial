def validar_formato(filename):
    validar_extension = {'png', 'jpg', 'jpeg', }
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in validar_extension
