const swaggerJsdoc = require("swagger-jsdoc");

const port = process.env.PORT || 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backend App API",
      version: "1.0.0",
      description: "API documentation for the Reservation App",
      termsOfService: "http://example.com/terms/",
      contact: {
        name: "TechNaps Support",
        url: "http://example.com/support",
        email: "support@technaps.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      tags: [
        {
          name: "Authentication",
          description: "Authentication with the local strategy",
        },
        {
          name: "Google Authentication",
          description: "Authentication with the google strategy",
        },
        {
          name: "2FA Authentication",
          description: "The management of the 2FA authentication",
        },
        {
          name: "Password Management",
          description:
            "The management of the password forget password and reset password",
        },
        {
          name: "Users",
          description:
            "The management of the password forget password and reset password",
        },
      ],
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
        },
        ValidationError: {
          description: "Validation failed for the input data",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);
module.exports = specs;


