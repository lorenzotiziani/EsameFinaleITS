import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { CorsiService } from './corsi.service';
import {
  corsoCreateDTO,
  corsoUpdateDTO,
  corsoChangeStatusDTO,
  CorsoListFilters,
} from './corsi.dto';

export class CorsiController {
  static async getCorsi(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { categoria, attivo } = req.query;

      const filters: CorsoListFilters = {
        categoria: typeof categoria === 'string' ? categoria : undefined,
        attivo: attivo === undefined ? undefined : attivo === 'true',
      };

      const userId = req.user!.userId
      const ruolo = req.user!.ruolo

      const corsi = await CorsiService.getCorsi(filters, userId, ruolo);

      res.json({
        success: true,
        data: corsi,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCorsoDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const corsoId = Number(req.params.id);

      const userId = req.user!.userId
      const ruolo = req.user!.ruolo


      const corso = await CorsiService.getCorsoById(corsoId, userId, ruolo);

      res.json({
        success: true,
        data: corso,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createCorso(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: corsoCreateDTO = req.body;

      const createdCorso = await CorsiService.createCorso(data);

      res.status(201).json({
        success: true,
        data: createdCorso,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCorso(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data: corsoUpdateDTO = req.body;

      const updatedCorso = await CorsiService.updateCorso(id, data);

      res.json({
        success: true,
        data: updatedCorso,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCorso(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);

      await CorsiService.deleteCorso(id);

      res.json({
        success: true,
        message: 'Corso eliminato con successo',
      });
    } catch (error) {
      next(error);
    }
  }

  static async changeStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { attivo }: corsoChangeStatusDTO = req.body;

      const updatedCorso = await CorsiService.changeStatusCorso(id, attivo);

      res.json({
        success: true,
        data: updatedCorso,
      });
    } catch (error) {
      next(error);
    }
  }
}
