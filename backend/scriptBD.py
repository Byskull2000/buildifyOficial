import mysql.connector
from mysql.connector import errorcode

print("Conectando...")
try:
    conn = mysql.connector.connect(
           host='jhoelcamacho.mysql.pythonanywhere-services.com',
           user='jhoelcamacho',
           password='mysqlroot'
      )
except mysql.connector.Error as err:
      if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print('Existe un error en el nombre de usuario o en la clave')
      else:
            print(err)

cursor = conn.cursor()

cursor.execute("DROP DATABASE IF EXISTS `jhoelcamacho$buildify`;")
cursor.execute("CREATE DATABASE `jhoelcamacho$buildify`;")
cursor.execute("USE `jhoelcamacho$buildify`;")

# Crear las tablas
TABLES = {}

TABLES['Cuenta_Authenticacion'] = ('''
    CREATE TABLE `Cuenta_Authenticacion` (
      `id_autenticacion` INT NOT NULL AUTO_INCREMENT,
      `Tipo_app` VARCHAR(50) NOT NULL,
      `id_app` VARCHAR(100),
      `email_app` VARCHAR(150),
      `fecha_creacion_aute` DATE,
      PRIMARY KEY (`id_autenticacion`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;''')

TABLES['Usuario'] = ('''
    CREATE TABLE `Usuario` (
      `id_usuario` INT NOT NULL AUTO_INCREMENT,
      `nombre_usuario` VARCHAR(80) NOT NULL,
      `correo_electronico` VARCHAR(100) NOT NULL,
      `contrasenia` VARCHAR(50) NOT NULL,
      `fecha_creacion` DATETIME,
      `ultimo_login` DATETIME,
      `estado_usuario` VARCHAR(15),
      `zona_trabajo` VARCHAR(50),
      `imagen_perfil` BLOB,
      PRIMARY KEY (`id_usuario`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;''')

# Relación entre Usuario y Cuenta_Authenticacion
TABLES['Usuario_Cuenta_Authenticacion'] = ('''
    CREATE TABLE `Usuario_Cuenta_Authenticacion` (
      `id_usuario` INT,
      `id_autenticacion` INT,
      PRIMARY KEY (`id_usuario`, `id_autenticacion`),
      CONSTRAINT `fk_usuario`
        FOREIGN KEY (`id_usuario`) 
        REFERENCES `Usuario` (`id_usuario`)
        ON DELETE CASCADE,
      CONSTRAINT `fk_autenticacion`
        FOREIGN KEY (`id_autenticacion`) 
        REFERENCES `Cuenta_Authenticacion` (`id_autenticacion`)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;''')

#tabla fotos y relacion con el usuario
TABLES['Fotos'] = ('''
    CREATE TABLE `Fotos` (
      `id_foto` INT NOT NULL AUTO_INCREMENT,
      `filename` VARCHAR(100) NOT NULL,
      `data` LONGBLOB NOT NULL,
      `id_usuario` INT,
      PRIMARY KEY (`id_foto`),
      CONSTRAINT `fk_foto_usuario`
        FOREIGN KEY (`id_usuario`) 
        REFERENCES `Usuario` (`id_usuario`)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
''')

# Ejecutar la creación de tablas
for tabla_nombre in TABLES:
    tabla_sql = TABLES[tabla_nombre]
    try:
        print('Creando tabla {}:'.format(tabla_nombre), end=' ')
        cursor.execute(tabla_sql)
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
            print('Ya existe la tabla')
        else:
            print(err.msg)
    else:
        print('OK')

# Insertar datos en la tabla Usuario
usuario_sql = '''
    INSERT INTO Usuario (nombre_usuario, correo_electronico, contrasenia, fecha_creacion, ultimo_login, estado_usuario, zona_trabajo, imagen_perfil)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
'''

usuarios = [
    ('Jhoel Camacho', 'jhoel2003camacho@gmail.com', 'password123', '2024-10-01 08:00:00', '2024-10-01 10:00:00', 'Activo', 'Zona Cercado', None),
    ('Juan Perez', 'juanP1234@gmail.com', 'juanperez123', '2024-10-01 09:30:00', '2024-10-01 11:30:00', 'Activo', 'Zona Norte', None),
    ('Maria Mendez', 'mariaMendez@gmail.com', 'maria1234', '2024-10-01 07:45:00', '2024-10-01 12:00:00', 'Inactivo', 'Zona Sud', None)
]

cursor.executemany(usuario_sql, usuarios)

# Insertar datos en la tabla Cuenta_Authenticacion
cuenta_auth_sql = '''
    INSERT INTO Cuenta_Authenticacion (Tipo_app, id_app, email_app, fecha_creacion_aute)
    VALUES (%s, %s, %s, %s);
'''

cuentas_auth = [
    ('Google', 'APP001', 'jhoel2003camacho@gmail.com', '2024-09-01'),
    ('Facebook', 'APP002', 'juan.perez@fb.com', '2024-09-02'),
    ('GitHub', 'APP003', 'maria.mendez@github.com', '2024-09-03')
]

cursor.executemany(cuenta_auth_sql, cuentas_auth)

# Relación entre usuarios y cuentas de autenticación
relacion_sql = '''
    INSERT INTO Usuario_Cuenta_Authenticacion (id_usuario, id_autenticacion)
    VALUES (%s, %s);
'''

relaciones = [
    (1, 1),
    (2, 2),
    (3, 3)
]

cursor.executemany(relacion_sql, relaciones)

# Commit para guardar los cambios si no hay nada que tenga efecto
conn.commit()

cursor.close()
conn.close()