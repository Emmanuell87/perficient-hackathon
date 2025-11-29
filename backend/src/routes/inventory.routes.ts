import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';

export const inventoryRouter = Router();
const controller = new InventoryController();

inventoryRouter.get('/dome/:domeId', (req, res, next) =>
  controller.getByDome(req, res, next)
);

inventoryRouter.post('/transfer', (req, res, next) =>
  controller.transfer(req, res, next)
);
