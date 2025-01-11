# Proyecto Foro-T

## Endpoints

### Autenticación
- `POST /api/auth/register`: Registra un nuevo usuario.
- `POST /api/auth/login`: Inicia sesión de usuario.
- `GET /api/auth/profile`: Obtiene el perfil del usuario actual.

### Publicaciones
- `GET /api/posts`: Obtiene todas las publicaciones (con paginación).
- `POST /api/posts`: Crea una nueva publicación (requiere autenticación).
- `PUT /api/posts/:id`: Actualiza una publicación existente (requiere autenticación).
- `DELETE /api/posts/:id`: Elimina una publicación (requiere autenticación).

### Subapartados
- `GET /api/subsections`: Obtiene todos los subapartados.
- `POST /api/subsections`: Crea un nuevo subapartado (requiere autenticación y rol de admin).
- `PUT /api/subsections/:id`: Actualiza un subapartado existente (requiere autenticación y rol de admin).
- `DELETE /api/subsections/:id`: Elimina un subapartado (requiere autenticación y rol de admin).

## Configuración del Entorno
- Crear un archivo `.env` en la carpeta `backend` con las siguientes variables:
  ```
  MONGO_URI=<tu_uri_de_mongodb>
  JWT_SECRET=<tu_secreto_jwt>
  ```

## Ejecución del Proyecto
- Instalar dependencias:
  ```sh
  npm install
  ```
- Iniciar el servidor:
  ```sh
  npm start
  ```

## Ejemplos de Uso
- Registro de usuario:
  ```sh
  curl -X POST -H "Content-Type: application/json" -d '{"username":"testuser","email":"test@example.com","password":"password123","age":25}' http://localhost:5000/api/auth/register
  ```
- Inicio de sesión:
  ```sh
  curl -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}' http://localhost:5000/api/auth/login
  ```
