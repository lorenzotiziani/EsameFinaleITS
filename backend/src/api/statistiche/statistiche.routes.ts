import { Router } from 'express';
import { StatisticheController } from './statistiche.controller';
import { validate } from '../../middleware/validate.middleware';
import { statisticheAcademyRequirements } from './statistiche.dto';
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/academy', requireAdmin, validate(statisticheAcademyRequirements), StatisticheController.getRiepilogoAcademy);

export default router;
