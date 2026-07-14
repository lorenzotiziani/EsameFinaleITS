import { NextFunction, Request, Response } from 'express';
import { StatisticheService } from './statistiche.service';
import { StatisticheAcademyFilters } from './statistiche.dto';

export class StatisticheController {
  static async getRiepilogoAcademy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { mese, categoria, dipendenteId } = req.query;

      const filters: StatisticheAcademyFilters = {
        mese: typeof mese === 'string' ? mese : undefined,
        categoria: typeof categoria === 'string' ? categoria : undefined,
        dipendenteId: typeof dipendenteId === 'string' ? Number(dipendenteId) : undefined,
      };

      const riepilogo = await StatisticheService.getRiepilogoAcademy(filters);

      res.json({
        success: true,
        data: riepilogo,
      });
    } catch (error) {
      next(error);
    }
  }
}
