import { NextFunction, Request, Response } from 'express';
import { Stati } from '@prisma/client';
import { AuthRequest } from '../../middleware/auth.middleware';
import { AssegnazioniService } from './assegnazioni.service';
import {
  AssegnazioneCreateDTO,
  AssegnazioneUpdateDTO,
  AssegnazioneListFilters,
} from './assegnazioni.dto';

export class AssegnazioniController {
  static async getAssegnazioni(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { stato, categoria, corsoId, dipendenteId } = req.query;

      const filters: AssegnazioneListFilters = {
        stato: typeof stato === 'string' ? (stato as Stati) : undefined,
        categoria: typeof categoria === 'string' ? categoria : undefined,
        corsoId: typeof corsoId === 'string' ? Number(corsoId) : undefined,
        dipendenteId: typeof dipendenteId === 'string' ? Number(dipendenteId) : undefined,
      };

      const userId = req.user!.userId;
      const ruolo = req.user!.ruolo;

      const assegnazioni = await AssegnazioniService.getAssegnazioni(filters, userId, ruolo);

      res.json({
        success: true,
        data: assegnazioni,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAssegnazioneDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const userId = req.user!.userId;
      const ruolo = req.user!.ruolo;

      const assegnazione = await AssegnazioniService.getAssegnazioneById(id, userId, ruolo);

      res.json({
        success: true,
        data: assegnazione,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createAssegnazione(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: AssegnazioneCreateDTO = req.body;

      const created = await AssegnazioniService.createAssegnazione(data);

      res.status(201).json({
        success: true,
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateAssegnazione(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data: AssegnazioneUpdateDTO = req.body;

      const updated = await AssegnazioniService.updateAssegnazione(id, data);

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAssegnazione(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);

      await AssegnazioniService.deleteAssegnazione(id);

      res.json({
        success: true,
        message: 'Assegnazione eliminata con successo',
      });
    } catch (error) {
      next(error);
    }
  }

  static async completaAssegnazione(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const userId = req.user!.userId;
      const ruolo = req.user!.ruolo;

      const updated = await AssegnazioniService.completaAssegnazione(id, userId, ruolo);

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async annullaAssegnazione(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);

      const updated = await AssegnazioniService.annullaAssegnazione(id);

      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
