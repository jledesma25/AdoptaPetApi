# 🐾 AdoptaPet API

API backend para AdoptaPet - Aplicación de adopción de mascotas. Desarrollada con Node.js, Express y PostgreSQL.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación Local](#-instalación-local)
- [Configuración de Variables de Entorno](#-configuración-de-variables-de-entorno)
- [Base de Datos](#-base-de-datos)
- [Despliegue en Railway](#-despliegue-en-railway)
- [Endpoints](#-endpoints)
- [Estructura del Proyecto](#-estructura-del-proyecto)

## ✨ Características

- ✅ Registro de usuarios con validaciones
- ✅ Autenticación con JWT (expiración 30 minutos)
- ✅ Recuperación de contraseña con OTP por email
- ✅ Arquitectura modular y desacoplada
- ✅ Validaciones robustas de datos
- ✅ Manejo de errores centralizado

## 🛠 Tecnologías

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **PostgreSQL** - Base de datos
- **bcrypt** - Hash de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **Resend** - Envío de emails
- **dotenv** - Manejo de variables de entorno

## 📦 Requisitos Previos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- Cuenta de Railway (para despliegue)
- Cuenta de Resend (para envío de emails)

## 💻 Instalación Local

1. **Clonar el repositorio** (o descargar el código)

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crea un archivo `.env` en la raíz del proyecto (ver sección de Variables de Entorno)

4. **Configurar la base de datos**
Ejecuta el script SQL en tu base de datos PostgreSQL:
```bash
psql -U tu_usuario -d tu_base_datos -f database.sql
```

5. **Iniciar el servidor**
```bash
npm start
```

El servidor estará corriendo en `http://localhost:3000` (o el puerto especificado en `PORT`)

## ⚙️ Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto del servidor
PORT=3000

# Base de datos PostgreSQL
PGHOST=tu_host_postgresql
PGDATABASE=tu_base_datos
PGUSER=tu_usuario
PGPASSWORD=tu_contraseña
PGPORT=5432

# JWT Secret (genera uno seguro)
JWT_SECRET=tu_jwt_secret_super_seguro_aqui

# Configuración de Resend (para emails)
RESEND_API_KEY=tu_api_key_de_resend
EMAIL_FROM=tu_email@tudominio.com
EMAIL_FROM_NAME=AdoptaPet
```

### Generar JWT_SECRET

Puedes generar un JWT_SECRET seguro usando Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🗄 Base de Datos

### Ejecutar Script SQL

Ejecuta el archivo `database.sql` en tu base de datos PostgreSQL para crear las tablas necesarias:

```bash
# Opción 1: Desde la línea de comandos
psql -U tu_usuario -d tu_base_datos -f database.sql

# Opción 2: Desde psql
psql -U tu_usuario -d tu_base_datos
\i database.sql
```

### Tablas Creadas

- **usuarios**: Almacena información de usuarios
  - `id`, `numero_documento`, `nombres`, `apellidos`, `correo`, `password_hash`, `created_at`, `updated_at`, `deleted_at`

- **password_reset_tokens**: Almacena tokens para recuperación de contraseña
  - `id`, `usuario_id`, `otp_code`, `otp_token`, `expires_at`, `used`, `created_at`

## 🚀 Despliegue en Railway

### Paso 1: Preparar el Repositorio

1. Asegúrate de tener todos los archivos en tu repositorio Git
2. El archivo `main.js` debe estar en la raíz del proyecto
3. El archivo `package.json` debe tener el script `"start": "node main.js"`

### Paso 2: Crear Proyecto en Railway

1. Ve a [Railway](https://railway.app/)
2. Inicia sesión o créate una cuenta
3. Haz clic en "New Project"
4. Selecciona "Deploy from GitHub repo" (o sube tu código directamente)

### Paso 3: Configurar Base de Datos PostgreSQL

1. En tu proyecto de Railway, haz clic en "New"
2. Selecciona "Database" → "Add PostgreSQL"
3. Railway creará automáticamente una base de datos PostgreSQL
4. Anota las variables de entorno que Railway genera automáticamente:
   - `PGHOST`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGPORT`

### Paso 4: Ejecutar Script SQL

1. Ve a la pestaña "Data" de tu base de datos PostgreSQL en Railway
2. Abre el "Query" o "SQL Editor"
3. Copia y pega el contenido del archivo `database.sql`
4. Ejecuta el script para crear las tablas

### Paso 5: Configurar Variables de Entorno

En Railway, ve a tu servicio (no la base de datos) y configura las siguientes variables de entorno:

**Variables de Base de Datos** (Railway las genera automáticamente, pero verifica):
- `PGHOST`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`
- `PGPORT`

**Variables de Aplicación**:
- `PORT` (Railway lo asigna automáticamente, pero puedes dejarlo)
- `JWT_SECRET` - Genera uno seguro (ver sección anterior)
- `RESEND_API_KEY` - Tu API key de Resend
- `EMAIL_FROM` - Email verificado en Resend (ej: `noreply@tudominio.com`)
- `EMAIL_FROM_NAME` - Nombre para mostrar (ej: `AdoptaPet`)

### Paso 6: Configurar Resend

1. Ve a [Resend](https://resend.com/) y crea una cuenta
2. Verifica tu dominio o usa el dominio de prueba
3. Genera una API Key
4. Configura `RESEND_API_KEY` en Railway
5. Configura `EMAIL_FROM` con un email verificado en Resend

### Paso 7: Desplegar

1. Railway detectará automáticamente Node.js
2. Instalará las dependencias (`npm install`)
3. Ejecutará `npm start`
4. Tu API estará disponible en la URL que Railway te proporcione

### Paso 8: Verificar Despliegue

Visita `https://tu-app.railway.app/ping` y deberías ver `pong 🏓`

## 📡 Endpoints

### Autenticación

#### `POST /register`
Registra un nuevo usuario.

**Body:**
```json
{
  "numero_documento": "12345678",
  "nombres": "Juan",
  "apellidos": "Pérez García",
  "correo": "juan@example.com",
  "password": "password123"
}
```

**Validaciones:**
- `numero_documento`: 8 dígitos numéricos, obligatorio, único
- `nombres`: Obligatorio
- `apellidos`: Obligatorio
- `correo`: Formato válido, obligatorio, único
- `password`: Mínimo 6 caracteres, obligatorio

**Respuesta exitosa:**
```json
{
  "message": "Usuario registrado correctamente",
  "user": {
    "id": 1,
    "numero_documento": "12345678",
    "nombres": "Juan",
    "apellidos": "Pérez García",
    "correo": "juan@example.com"
  }
}
```

#### `POST /login`
Inicia sesión con documento y contraseña.

**Body:**
```json
{
  "numero_documento": "12345678",
  "password": "password123"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "numero_documento": "12345678",
    "nombres": "Juan",
    "apellidos": "Pérez García",
    "nombreCompleto": "Juan Pérez García",
    "correo": "juan@example.com"
  }
}
```

**Token JWT:** Expira en 30 minutos

### Recuperación de Contraseña

#### `POST /usuarios/recuperar-contrasena`
Solicita recuperación de contraseña. Envía un código OTP por email.

**Body:**
```json
{
  "correo": "juan@example.com"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Código de verificación enviado a tu correo",
  "token": "abc123def456..."
}
```

**Nota:** El código OTP se envía por email. El token retornado se usa en el siguiente paso.

#### `POST /usuarios/verificar-otp`
Verifica el código OTP recibido por email.

**Body:**
```json
{
  "correo": "juan@example.com",
  "otp_code": "1234",
  "token": "abc123def456..."
}
```

**Respuesta exitosa:**
```json
{
  "message": "Código verificado correctamente",
  "reset_token": "xyz789..."
}
```

**Nota:** El `reset_token` se usa en el siguiente paso para cambiar la contraseña.

#### `POST /usuarios/cambiar-contrasena`
Cambia la contraseña después de verificar el OTP.

**Body:**
```json
{
  "reset_token": "xyz789...",
  "nueva_password": "nuevaPassword123"
}
```

**Validaciones:**
- `nueva_password`: Mínimo 6 caracteres

**Respuesta exitosa:**
```json
{
  "message": "Contraseña actualizada correctamente"
}
```

### Utilidades

#### `GET /ping`
Endpoint de prueba para verificar que el servidor está funcionando.

**Respuesta:**
```
pong 🏓
```

## 📁 Estructura del Proyecto

```
AdoptaPetApi/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración PostgreSQL
│   │   └── server.js            # Configuración Express
│   ├── middlewares/
│   │   └── auth.js              # Middleware de autenticación JWT
│   ├── routes/
│   │   ├── auth.routes.js       # Rutas de autenticación
│   │   └── password.routes.js   # Rutas de recuperación
│   ├── controllers/
│   │   ├── auth.controller.js   # Controladores de autenticación
│   │   └── password.controller.js # Controladores de recuperación
│   ├── services/
│   │   ├── user.service.js      # Servicio de usuarios
│   │   ├── passwordReset.service.js # Servicio de tokens
│   │   ├── email.service.js     # Servicio de emails
│   │   └── auth.service.js      # Servicio de autenticación
│   └── utils/
│       ├── validators.js        # Validaciones
│       ├── emailTemplate.js     # Templates de email
│       └── tokens.js            # Generación de tokens
├── main.js                      # Punto de entrada
├── package.json                 # Dependencias
├── database.sql                 # Script SQL
└── README.md                    # Este archivo
```

## 🔒 Seguridad

- Las contraseñas se almacenan con hash usando bcrypt
- Los tokens JWT tienen expiración de 30 minutos
- Los códigos OTP expiran en 15 minutos
- Los tokens de reset expiran en 1 hora
- Validación de datos en todos los endpoints
- Soft delete para usuarios (campo `deleted_at`)

## 🐛 Solución de Problemas

### Error: "JWT_SECRET no definido"
- Verifica que la variable de entorno `JWT_SECRET` esté configurada en Railway

### Error: "Error al enviar correo"
- Verifica que `RESEND_API_KEY` esté correctamente configurado
- Verifica que `EMAIL_FROM` sea un email verificado en Resend
- Revisa los logs de Railway para más detalles

### Error de conexión a PostgreSQL
- Verifica que todas las variables de entorno de PostgreSQL estén configuradas
- Asegúrate de haber ejecutado el script `database.sql`
- En Railway, verifica que la base de datos esté activa

### Error 404 en endpoints
- Verifica que la URL base sea correcta (Railway proporciona una URL)
- Verifica que el servidor esté corriendo (revisa logs en Railway)

## 📝 Notas Adicionales

- El proyecto usa CommonJS (`require/module.exports`)
- El puerto se configura automáticamente en Railway, pero puedes usar la variable `PORT`
- Los emails se envían usando Resend, asegúrate de tener un dominio verificado o usar el dominio de prueba
- Las tablas se crean automáticamente al ejecutar `database.sql`

## 📄 Licencia

ISC

## 👤 Autor

Desarrollado para AdoptaPet

---

**¿Problemas o preguntas?** Revisa los logs en Railway o la sección de Solución de Problemas.
