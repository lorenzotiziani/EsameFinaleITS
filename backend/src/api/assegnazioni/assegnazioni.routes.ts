import { Router } from 'express';
import { AssegnazioniController } from './assegnazioni.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  assegnazioneListRequirements,
  assegnazioneCreateRequirements,
  assegnazioneUpdateRequirements,
} from './assegnazioni.dto';
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware';
import { idRequirements } from '../dto/public.dto';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(assegnazioneListRequirements), AssegnazioniController.getAssegnazioni);
router.get('/:id', validate(idRequirements), AssegnazioniController.getAssegnazioneDetails);

router.post('/', requireAdmin, validate(assegnazioneCreateRequirements), AssegnazioniController.createAssegnazione);
router.put('/:id', requireAdmin, validate(idRequirements), validate(assegnazioneUpdateRequirements), AssegnazioniController.updateAssegnazione);
router.delete('/:id', requireAdmin, validate(idRequirements), AssegnazioniController.deleteAssegnazione);

router.put('/:id/completa', validate(idRequirements), AssegnazioniController.completaAssegnazione);

router.put('/:id/annulla', requireAdmin, validate(idRequirements), AssegnazioniController.annullaAssegnazione);

export default router;
