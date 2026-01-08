import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Products API",
      version: "1.0.0",
      description: "Express + Prisma backend API documentation",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local server",
      },
    ],
    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            id: { type: "number" },
            title: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            discountPercentage: { type: "number" },
            rating: { type: "number" },
            stock: { type: "number" },
            brand: { type: "string" },
            category: { type: "string" },
            thumbnail: { type: "string", nullable: true },
            images: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
