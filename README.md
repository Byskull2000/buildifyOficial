# Instrucciones

## Requerimientos

***backend***

- Python 3.10

***frontend***

- Node Js 20.12

## Como Iniciar

### Backend

abrir el directorio backend

```cd backend```

crear el entorno virtual

```python -m venv .venv```

abrir el entorno virtual

```./.venv/Scripts/activate```

intalar las dependencias

```pip install -r requirements.txt```

iniciar servidor

```flask run --debug```

### Antes de Realizar un Push

Crear o Actualizar el archivo requirements.txt en caso de instalar alguna dependencia nueva

```python -m pip freeze > requirements.txt```

### Frontend

abrir el directorio frontend

```cd frontend```

instalar dependencias

```npm install```

iniciar

```npm run dev```

## Como verificar que el frontend funcionara en PythonAnywhere

1. acceder al directorio frontend

    ```cd frontend```

2. generar los archivos estaticos de react

    ```npm run build```
3. abrir el directorio del backend desde el frontend

    ```cd ..\backend\```

4. iniciar el entorno virtual si es que lo tienes creado caso contrario crearlo e instalar los requerimientos

    ```./.venv/Scripts/activate```

5. iniciar el servidor

    ```flask run```

6. abrir el navegador

    <http://localhost:5000>

## ***En Caso de trabajar con un ORM En el backend ***
hacer lo siguiente

1. flask db init  # Solo la primera vez
2. flask db migrate -m "Creacion de Tabla Usuario" # el usuario es un ejemplo
3. flask db upgrade

## Integrantes

- Anturiano Eulate Eleonor Camile
- Bruno Meneses Nestor Antonio
- Camacho Vargas Jhoel Freddy
- Grájeda Herrera Diego Gualberto
- García Llanqui Jhunior Remberto
- Limachi García Pablo Hans
