const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AdoptaPet API",
      version: "1.0.0",
      description: "API backend para AdoptaPet - Aplicación de adopción de mascotas",
      contact: {
        name: "AdoptaPet",
      },
    },
    servers: [
      {
        url: "https://adoptapetapi-production.up.railway.app",
        description: "Servidor de producción",
      },
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Mensaje de error",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["numero_documento", "nombres", "apellidos", "correo", "password"],
          properties: {
            numero_documento: {
              type: "string",
              pattern: "^\\d{8}$",
              description: "Número de documento (8 dígitos numéricos)",
              example: "12345678",
            },
            nombres: {
              type: "string",
              description: "Nombres del usuario",
              example: "Juan",
            },
            apellidos: {
              type: "string",
              description: "Apellidos del usuario",
              example: "Pérez García",
            },
            correo: {
              type: "string",
              format: "email",
              description: "Correo electrónico",
              example: "juan@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              description: "Contraseña (mínimo 6 caracteres)",
              example: "123456",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["numero_documento", "password"],
          properties: {
            numero_documento: {
              type: "string",
              description: "Número de documento",
              example: "12345678",
            },
            password: {
              type: "string",
              description: "Contraseña",
              example: "123456",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Login exitoso",
            },
            token: {
              type: "string",
              description: "Token JWT (expira en 30 minutos)",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: {
              type: "object",
              properties: {
                id: {
                  type: "integer",
                  example: 1,
                },
                numero_documento: {
                  type: "string",
                  example: "12345678",
                },
                nombres: {
                  type: "string",
                  example: "Juan",
                },
                apellidos: {
                  type: "string",
                  example: "Pérez García",
                },
                nombreCompleto: {
                  type: "string",
                  example: "Juan Pérez García",
                },
                correo: {
                  type: "string",
                  example: "juan@example.com",
                },
              },
            },
          },
        },
        RecuperarPasswordRequest: {
          type: "object",
          required: ["correo"],
          properties: {
            correo: {
              type: "string",
              format: "email",
              description: "Correo electrónico del usuario",
              example: "juan@example.com",
            },
          },
        },
        VerificarOTPRequest: {
          type: "object",
          required: ["correo", "otp_code", "token"],
          properties: {
            correo: {
              type: "string",
              format: "email",
              example: "juan@example.com",
            },
            otp_code: {
              type: "string",
              description: "Código OTP recibido por email (4 dígitos)",
              example: "1234",
            },
            token: {
              type: "string",
              description: "Token recibido al solicitar recuperación",
              example: "abc123def456...",
            },
          },
        },
        CambiarPasswordRequest: {
          type: "object",
          required: ["reset_token", "nueva_password"],
          properties: {
            reset_token: {
              type: "string",
              description: "Token recibido al verificar el OTP",
              example: "xyz789...",
            },
            nueva_password: {
              type: "string",
              minLength: 6,
              description: "Nueva contraseña (mínimo 6 caracteres)",
              example: "nuevaPassword123",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js", "./main.js"],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
