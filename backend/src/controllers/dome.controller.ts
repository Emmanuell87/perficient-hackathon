import { Request, Response, NextFunction } from 'express';
import { DomeService } from '../services/dome.service';

const service = new DomeService();

export class DomeController {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const domes = await service.getAllDomes();
      res.json(domes);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dome = await service.getDomeById(id);
      if (!dome) return res.status(404).json({ error: 'Dome not found' });
      res.json(dome);
    } catch (err) {
      next(err);
    }
  }
}
