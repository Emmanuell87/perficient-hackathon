import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { inventoryTransferSchema } from '../models/inventory.models';

const service = new InventoryService();

export class InventoryController {
  async getByDome(req: Request, res: Response, next: NextFunction) {
    try {
      const { domeId } = req.params;
      const data = await service.getInventoryByDome(domeId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async transfer(req: Request, res: Response, next: NextFunction) {
    try {
      const body = inventoryTransferSchema.parse(req.body);
      const result = await service.transferResources(body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
}
