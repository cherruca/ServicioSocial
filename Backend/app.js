import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import {errorHandler} from './src/middleware/error.middleware.js'
import {mainRouter} from './src/routes/main.route.js';
import {connectiondb} from './src/config/dbConnection.config.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger.config.js';

const corsOptions = {
 origin: ['http://localhost:5173'], // Especificar orígenes permitidos CROSS ORIGIN uwu
 methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
 allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
 credentials: true, // Permitir credenciales como cookies
};

const app = express();
// In test environment we start the database from the test setup (mongodb-memory-server).
if (process.env.NODE_ENV !== 'test') {
    connectiondb();
}
app.use(cors(corsOptions));
app.use(express.json());
// Swagger UI and JSON spec
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

app.use(mainRouter);
app.use(errorHandler);


const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, ()=>{
            console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
