import { Router } from 'express';
import { CorsiController } from './corsi.controller';
import { validate } from '../../middleware/validate.middleware';
import { corsoCreateRequirements, corsoUpdateRequirements, corsoChangeStatusRequirements, corsoListRequirements} from './corsi.dto';
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware';
import { idRequirements } from '../dto/public.dto';

const router = Router();

router.use(authMiddleware)

router.get('/', validate(corsoListRequirements), CorsiController.getCorsi);
router.get('/:id', validate(idRequirements), CorsiController.getCorsoDetails);

router.post('/', requireAdmin, validate(corsoCreateRequirements), CorsiController.createCorso);
router.put('/:id', requireAdmin,validate(idRequirements), validate(corsoUpdateRequirements), CorsiController.updateCorso);
router.delete('/:id', requireAdmin,validate(idRequirements), CorsiController.deleteCorso)
router.put('/:id/changeStatus',requireAdmin,validate(idRequirements), validate(corsoChangeStatusRequirements),CorsiController.changeStatus);

export default router;