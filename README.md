## Backend-2

API REST para una plataforma de venta de entradas para eventos, con gestion de usuarios, eventos, sesiones y tickets

Tecnologias
Node.js
Express
MongoDB
Mongoose
dotenv
JavaScript (ES Modules)

## Instalacion
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

## Como Ejecutar:
npm run dev

## El servidor estara disponible en:
http://localhost:3000

## Estructura de carpetas:
backend-2/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── routers/
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
POST /api/sessions
GET /api/users
GET /api/tickets

## Estado del proyecto:
Proyecto correspondientes a la pre entrega 1
