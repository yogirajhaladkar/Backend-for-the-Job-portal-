import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Job Portal API",
            version: "1.0.0",
            description: "Job Portal Backend API Documentation"
        },
        servers: [
            {
                url: "http://localhost:4000/api/v1",
            }
        ]
    },

    apis: [
        "./src/routes/*.js"
    ]
};

const specs = swaggerJsDoc(options);

export { swaggerUi, specs };