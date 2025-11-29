import { Router } from 'express';
import { DomeController } from '../controllers/dome.controller';

export const domeRouter = Router();
const controller = new DomeController();

domeRouter.get('/', (req, res, next) => controller.getAll(req, res, next));
domeRouter.get('/:id', (req, res, next) => controller.getById(req, res, next));
