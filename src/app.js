import express from 'express';
import privateRoute from './routes/private.routes.js';
import connectDB from './config/db/devMongoDB.js';
import cors from 'cors';
import verifyToken from './components/auth/token.service.js';
import manipulator404 from './middlewares/notFound.manipulator.js';
import errorsManipulator from './middlewares/errors.manipulator.js';
import publicRoute from './routes/public.routes.js';
import swaggerUi from 'swagger-ui-express';
import { loadSwagger } from './utils/loadSwagger.js'

connectDB();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: '*',
  methods: 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Access-Control-Allow-Origin'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

publicRoute(app);

let swaggerDocs;
try {
  swaggerDocs = await loadSwagger();
} catch (error) {
  console.warn('Não foi possível carregar o Swagger:', error.message);
  swaggerDocs = {}; 
}
if (Object.keys(swaggerDocs).length > 0) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
} else {
  console.warn('Documentação Swagger não disponível');
}

app.use(verifyToken);
privateRoute(app);
    
app.use(manipulator404);
app.use(errorsManipulator);

export default app;