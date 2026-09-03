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
- Nodemailer

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

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_email
MAIL_PASS=tu_app_password
MAIL_FROM=tu_email

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
│   ├── dto/
│   ├── models/
│   ├── middlewares/
│   └── utils/
│   └── utils.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

## Rutas disponibles

### Endpoints principales

| Método | Endpoint | Autenticación | Descripción |
|---|---|---|---|
| GET | `/api/health` | No | Verificar estado del servidor |
| POST | `/api/sessions/register` | No | Registrar usuario |
| POST | `/api/sessions/login` | No | Iniciar sesión |
| GET | `/api/sessions/current` | Sí | Obtener usuario autenticado |
| POST | `/api/sessions/logout` | No | Cerrar sesión |
| GET | `/api/users` | Sí + admin | Listar usuarios |
| GET | `/api/events` | No | Listar eventos |
| GET | `/api/events/:eventId` | No | Obtener evento por ID |
| POST | `/api/events` | Sí + organizer/admin | Crear evento |
| PUT | `/api/events/:eventId` | Sí + organizer/admin | Modificar evento |
| PATCH | `/api/events/:eventId/status` | Sí + organizer/admin | Cambiar estado |
| POST | `/api/events/:eid/tickets` | Sí | Inscribirse a evento |
| GET | `/api/events/:eid/tickets` | Sí + dueño/admin | Ver tickets de un evento |
| GET | `/api/tickets/my-tickets` | Sí | Ver mis tickets |
| PATCH | `/api/tickets/:tid/cancel` | Sí + dueño/admin | Cancelar ticket |

### Health

GET /api/health

Ruta pública para verificar que el servidor se encuentra activo.

## Eventos

La entidad `Event` contiene los siguientes campos:

- `title`: título del evento.
- `description`: descripción.
- `category`: categoría.
- `date`: fecha del evento.
- `location`: ubicación.
- `capacity`: capacidad máxima.
- `price`: precio.
- `status`: estado del evento.
- `organizer`: referencia al usuario organizador.

El campo `organizer` almacena una referencia `ObjectId` al modelo de usuario y no un usuario embebido.

### Estados disponibles

Los eventos pueden tener los siguientes estados:

- `draft`
- `published`
- `cancelled`
- `finished`

Los eventos cancelados no se eliminan físicamente de la base de datos.

### Crear evento

POST /api/events

Requiere autenticación y rol organizer o admin.

Ejemplo:

{
  "title": "Workshop de prueba",
  "description": "Evento para probar la plataforma",
  "category": "workshop",
  "date": "2027-07-20",
  "location": "Buenos Aires",
  "capacity": 100,
  "price": 500,
  "status": "draft"
}

El organizer se asigna automáticamente a partir del usuario autenticado y no puede enviarse desde el body.

### Listar eventos

GET /api/events

La ruta es pública y permite utilizar filtros, paginación y ordenamiento.

### Filtros

Por estado:

GET /api/events?status=published

Por categoría:

GET /api/events?category=workshop

Por ubicación:

GET /api/events?location=Buenos Aires

Por rango de fechas:

GET /api/events?dateFrom=2027-01-01&dateTo=2027-12-31

Los filtros pueden combinarse:

GET /api/events?status=published&category=workshop

### Paginación

Se utilizan los parámetros:

page: número de página.
limit: cantidad de resultados por página.

Ejemplo:

GET /api/events?page=2&limit=5

### Ordenamiento

El listado permite ordenar mediante el parámetro sort.

Ejemplo:

GET /api/events?sort=date

### Ejemplo completo

GET /api/events?status=published&category=workshop&page=2&limit=5

La respuesta incluye:

{
  "status": "success",
  "payload": {
    "data": [],
    "page": 2,
    "limit": 5,
    "total": 0,
    "totalPages": 0
  }
}
### Obtener evento por ID

GET /api/events/:eventId

Ruta pública.

Si el evento no existe, devuelve 404 Not Found.

### Modificar evento

PUT /api/events/:eventId

Requiere autenticación y rol organizer o admin.

Los organizadores solamente pueden modificar sus propios eventos.

Los administradores pueden modificar cualquier evento.

Los eventos cancelados no pueden modificarse.

### Cambiar estado

PATCH /api/events/:eventId/status

Body:

{
  "status": "published"
}

Requiere autenticación y rol organizer o admin.

Los eventos cancelados no pueden volver a modificarse.

Un evento finalizado no puede pasar nuevamente a published.

### Reglas de negocio

Las validaciones de negocio se encuentran implementadas en los services.

No se permite crear un evento con fecha pasada.
No se permite modificar un evento utilizando una fecha pasada.
Las fechas inválidas son rechazadas.
La capacidad debe ser mayor a 0.
El precio debe ser mayor o igual a 0.
Los estados permitidos son draft, published, cancelled y finished.
No se puede publicar un evento finalizado.
No se puede modificar un evento cancelado.
La cancelación se realiza cambiando su estado a cancelled, sin eliminar físicamente el documento.

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

### Flujo de autenticación

El flujo de autenticación de la API es el siguiente:

1. El usuario se registra mediante `POST /api/sessions/register`.
2. El usuario inicia sesión mediante `POST /api/sessions/login`.
3. Passport valida las credenciales y se genera un JWT.
4. El JWT se almacena en la cookie HTTP Only `currentUser`.
5. Las rutas protegidas utilizan el middleware `auth` para validar el token.
6. El usuario autenticado queda disponible en `req.user`.
7. El endpoint `GET /api/sessions/current` permite consultar la sesión actual.
8. `POST /api/sessions/logout` elimina la cookie y finaliza la sesión.
9. Si se intenta acceder a una ruta protegida sin una sesión válida, la API devuelve `401 Unauthorized`.
10. Si el usuario está autenticado pero no posee el rol necesario, la API devuelve `403 Forbidden`.

### Flujo de inscripción

El flujo para inscribirse a un evento es:

1. Un usuario con rol `organizer` o `admin` crea un evento mediante `POST /api/events`.
2. El evento debe encontrarse en estado `published` para permitir inscripciones.
3. Un usuario autenticado realiza `POST /api/events/:eid/tickets` indicando la cantidad de lugares.
4. El Service verifica que el evento exista y esté publicado.
5. Se verifica que el usuario no tenga una inscripción activa para el mismo evento.
6. Se calcula la cantidad de cupos ocupados y disponibles.
7. Si existen cupos suficientes, se crea el ticket con un código de reserva único.
8. Se envía un email de confirmación mediante Nodemailer.
9. El usuario puede consultar sus tickets mediante `GET /api/tickets/my-tickets`.
10. El ticket puede cancelarse mediante `PATCH /api/tickets/:tid/cancel`.
11. Los tickets cancelados no cuentan como cupo ocupado y permiten realizar una nueva inscripción.

## Roles y autorización

El sistema maneja tres roles de usuario:

- `user`: usuario registrado.
- `organizer`: organizador de eventos.
- `admin`: administrador del sistema.

El rol se establece por defecto como `user` durante el registro público. No es posible asignar los roles `organizer` o `admin` desde el endpoint público de registro.

### Usuarios de prueba

Para probar los diferentes permisos de la API se pueden crear usuarios mediante `POST /api/sessions/register`.

El registro público crea automáticamente usuarios con rol `user`.

Para probar los roles `organizer` y `admin`, se deben utilizar usuarios previamente configurados con esos roles en la base de datos.

Ejemplo de usuario `user`:

json
{
  "first_name": "Lucas",
  "last_name": "Melo",
  "email": "lucas@test.com",
  "password": "123456"
}


Los usuarios creados mediante el registro público reciben el rol `user` por defecto y no pueden asignar `organizer` o `admin` desde el body.

### Matriz de permisos

| Acción | user | organizer | admin |
|---|---|---|---|
| Ver eventos publicados | Sí | Sí | Sí |
| Crear eventos | No | Sí | Sí |
| Modificar sus propios eventos | No | Sí | Sí |
| Modificar eventos de otros organizadores | No | No | Sí |
| Ver todos los usuarios | No | No | Sí |

### Middleware de autenticación

El middleware `auth` verifica la existencia y validez del JWT almacenado en la cookie `currentUser`.

Cuando el token es válido, los datos del usuario quedan disponibles en `req.user`.

Si el usuario no está autenticado o el token es inválido, se devuelve un código HTTP `401 Unauthorized`.

### Middleware de autorización

El middleware `authorize` permite definir qué roles pueden acceder a una ruta.

Por ejemplo:

js
authorize("organizer", "admin")

md
permite el acceso únicamente a usuarios con rol `organizer` o `admin`.

Si el usuario está autenticado pero no posee el rol requerido, se devuelve un código HTTP `403 Forbidden`.

### Rutas protegidas

#### Crear eventos

POST /api/events

Requiere autenticación y rol `organizer` o `admin`.

El organizador se asigna automáticamente a partir del usuario autenticado.

#### Modificar eventos

PUT /api/events/:eventId

Requiere autenticación y rol `organizer` o `admin`.

Los organizadores solamente pueden modificar sus propios eventos. Los administradores pueden modificar cualquier evento.

Si un organizador intenta modificar un evento perteneciente a otro organizador, se devuelve `403 Forbidden`.

#### Ver todos los usuarios

GET /api/users

Requiere autenticación y rol `admin`.

Un usuario autenticado con otro rol recibe `403 Forbidden`.

#### Usuario actual

GET /api/sessions/current

Requiere autenticación.

Sin una cookie JWT válida se devuelve `401 Unauthorized`.

### Diferencia entre 401 y 403

- `401 Unauthorized`: el usuario no está autenticado o el token no es válido.
- `403 Forbidden`: el usuario está autenticado, pero no tiene permisos suficientes para realizar la acción.

## Tickets e inscripciones

Los tickets representan la inscripción de un usuario a un evento.

La entidad `Ticket` contiene los siguientes campos:

- `user`: referencia `ObjectId` al usuario.
- `event`: referencia `ObjectId` al evento.
- `status`: estado del ticket.
- `quantity`: cantidad de lugares reservados.
- `reservationCode`: código único de reserva.
- `createdAt`: fecha de creación.
- `cancelledAt`: fecha de cancelación.

Las referencias a usuarios y eventos se almacenan mediante `ObjectId` y no se utilizan objetos embebidos.

### Estados de los tickets

Los tickets pueden tener los siguientes estados:

- `confirmed`
- `pending`
- `cancelled`

Los tickets cancelados no se eliminan físicamente de la base de datos.

### Inscribirse a un evento

POST /api/events/:eid/tickets

Requiere autenticación.

Body:

json
{
  "quantity": 2
}


La inscripción valida que:

- El evento exista.
- El evento se encuentre en estado `published`.
- La cantidad sea un número entero mayor a 0.
- El usuario no tenga una inscripción activa previa para el mismo evento.
- Existan cupos suficientes.

Si la inscripción es exitosa, se genera un código único de reserva y se envía un email de confirmación.

Si no hay cupos suficientes o existe una inscripción activa, se devuelve `409 Conflict`.

### Mis tickets

GET /api/tickets/my-tickets

Requiere autenticación.

Devuelve únicamente los tickets correspondientes al usuario autenticado.

Los datos básicos del evento se obtienen mediante `populate`.

La respuesta no expone información sensible del usuario.

### Tickets de un evento

GET /api/events/:eid/tickets

Requiere autenticación y rol `organizer` o `admin`.

Los organizadores solamente pueden consultar los tickets de sus propios eventos.

Los administradores pueden consultar los tickets de cualquier evento.

La respuesta utiliza DTO para controlar la información del usuario relacionado.

### Cancelar ticket

PATCH /api/tickets/:tid/cancel

Requiere autenticación.

El usuario solamente puede cancelar sus propios tickets.

Los administradores pueden cancelar cualquier ticket.

La cancelación no elimina el documento de la base de datos. El ticket pasa al estado `cancelled` y se registra la fecha en `cancelledAt`.

Los tickets cancelados dejan de contar como cupo ocupado y permiten realizar una nueva inscripción.


## Arquitectura en capas

El proyecto utiliza una arquitectura separada en capas para desacoplar las responsabilidades de la aplicación.

### DAO

Los DAO son la única capa que accede directamente a los modelos de Mongoose.

Se encargan de realizar las operaciones de acceso a datos como crear, buscar, actualizar y contar documentos.

Se encuentran en:

src/dao/

### Repository

Los Repository utilizan los DAO correspondientes y exponen métodos orientados al dominio.

Se encuentran en:

src/repositories/

### Services

Los Services contienen la lógica de negocio de la aplicación.

Se encargan de validar reglas de negocio, estados de eventos, disponibilidad de cupos, inscripciones duplicadas, permisos sobre recursos propios y envío de emails.

Se encuentran en:

src/services/

### Controllers

Los Controllers coordinan las solicitudes HTTP.

Extraen información del request, llaman a los Services y construyen la respuesta HTTP.

No acceden directamente a los modelos de Mongoose.

Se encuentran en:

src/controllers/

### DTO

Los DTO controlan la información que se expone en las respuestas de la API.

Permiten evitar la exposición de información sensible como contraseñas y filtrar los datos de documentos relacionados cuando se utiliza populate.

Se encuentran en:

src/dto/

### Flujo de la arquitectura

El flujo general de una operación es:

Controller → Service → Repository → DAO → Model

Para las respuestas:

Model → DAO → Repository → Service → Controller → DTO → Response


## Estado del proyecto

Entrega final