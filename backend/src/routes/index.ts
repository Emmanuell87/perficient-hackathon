import { Router } from 'express';
import { domeRouter } from './dome.routes';
import { inventoryRouter } from './inventory.routes';

export const apiRouter = Router();

apiRouter.use('/domes', domeRouter);
apiRouter.use('/inventory', inventoryRouter);
