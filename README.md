## Backend-2

API REST para una plataforma de venta de entradas para eventos, con gestión de usuarios, eventos, sesiones y tickets.

## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- JavaScript (ES Modules)
- jsonwebtoken
- cookie-parser
- bcrypt
- Passport.js
- passport-custom


## Instalación

1. Clonar el repositorio:

git clone https://github.com/LucasNicolasMelo/backend-2.git

2. Ingresar al proyecto:

cd backend-2

3. Instalar las dependencias:

npm install

## Variables de entorno

PORT=3000

NODE_ENV=development

MONGO_URL=tu_url_de_mongodb

JWT_SECRET=tu_clave_secreta

JWT_EXPIRES_IN=1h

## Cómo ejecutar

npm run dev

## El servidor estará disponible en

http://localhost:3000

## Estructura de carpetas

backend-2/

├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── dao/
│   ├── models/
│   ├── middlewares/
│   └── utils.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

## Rutas disponibles

GET /api/health

GET /api/events

GET /api/users

GET /api/tickets

POST /api/sessions/register

POST /api/sessions/login

GET /api/sessions/current

POST /api/sessions/logout

## Registro de usuario

Para registrar un usuario:

POST /api/sessions/register

Body:

{
  "first_name": "Lucas",
  "last_name": "Melo",
  "email": "lucas@test.com",
  "password": "123456"
}

Campos obligatorios:

- first_name
- last_name
- email
- password

El email se normaliza automáticamente y la contraseña se almacena utilizando bcrypt.

La respuesta de registro no incluye la contraseña.

## Login

POST /api/sessions/login

Permite iniciar sesión utilizando email y contraseña.

Body:

{
  "email": "lucas@test.com",
  "password": "123456"
}

Respuesta:

{
  "status": "success",
  "message": "Login exitoso"
}

Al iniciar sesión correctamente se genera un token JWT que se almacena en la cookie `currentUser`.

## Usuario actual

GET /api/sessions/current

Ruta protegida por middleware de autenticación.

Obtiene los datos del usuario actualmente autenticado a partir del token JWT almacenado en la cookie `currentUser`.

Respuesta:

{
  "status": "success",
  "payload": {
    "id": "id_del_usuario",
    "email": "lucas@test.com",
    "role": "user"
  }
}

Si no existe una cookie válida, devuelve:

{
  "status": "error",
  "message": "No autenticado"
}

## Logout

POST /api/sessions/logout

Cierra la sesión eliminando la cookie `currentUser`.

Respuesta:

{
  "status": "success",
  "message": "Logout exitoso"
}

## Autenticación

La autenticación utiliza Passport.js, JSON Web Tokens (JWT) y cookies HTTP Only.

El sistema cuenta con las siguientes estrategias de Passport:

- `register`: gestiona el registro de usuarios, validación de campos, normalización del email, hash de contraseña con bcrypt, validación de unicidad y rol por defecto.
- `login`: valida las credenciales del usuario mediante email y contraseña.
- `current`: valida el JWT almacenado en la cookie `currentUser` y deja el usuario disponible en `req.user`.

El JWT contiene:

- id
- email
- role

El tiempo de expiración del token se configura mediante la variable `JWT_EXPIRES_IN`.

El token se almacena en una cookie `httpOnly` llamada `currentUser`.

El JWT es generado por el controller después de una autenticación exitosa mediante Passport.

Las contraseñas de los usuarios se almacenan utilizando bcrypt.

La configuración de Passport se encuentra centralizada en `src/config/passport.config.js`, permitiendo agregar futuras estrategias o providers externos como Google o GitHub sin modificar `app.js`.

## Estado del proyecto

Pre-entrega 4