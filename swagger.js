const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Pokemons API',
            version: '1.0.0',
            description: 'API to manage Pokemons',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
        ],
    },
    apis: ['./main.js']
};

module.exports = swaggerOptions;
