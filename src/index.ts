import express, { Request, Response } from 'express';
import { authRoutes, groceriesRoutes, ordersRoutes } from './routes';
// import { authRoutes, rolesRoutes, userRoutes } from 'routes';

const app = express();

const apiVersionPrefix = '/api/v1';

// CONFIGURATION
app.use(express.json());

// ROUTES
app.get(`${apiVersionPrefix}/health`, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Its working!' });
});

// DEFINE THE SHARED PREFIX FOR ALL API ROUTES
const apiRouter = express.Router();

// MOUNT INDIVIDUAL ROUTE MODULES UNDER THE SHARED PREFIX
apiRouter.use('/orders', ordersRoutes);
apiRouter.use('/groceries', groceriesRoutes);
apiRouter.use('/auth', authRoutes);

// USE THE SHARED PREFIX FOR ALL API ROUTES
app.use(apiVersionPrefix, apiRouter);

// MIDDLEWARES
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err?.stack || 'No stack trace available');
  
    res.status(500).json({
      error: 'Internal Server Error',
      message: err?.message || 'Something went wrong',
    });
});

export { app };
