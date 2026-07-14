import {Router} from 'express';
import authRouter from './api/auth/auth.routes';
import userRouter from './api/user/user.routes';
import corsiRouter from './api/corsi/corsi.routes'
import assegnazioniRouter from './api/assegnazioni/assegnazioni.routes'
import statisticheRouter from './api/statistiche/statistiche.routes'
const router=Router();

router.use('/auth',authRouter)
router.use('/users',userRouter)
router.use('/corsi',corsiRouter)
router.use('/assegnazioni-corsi',assegnazioniRouter)
router.use('/statistiche',statisticheRouter)

export default router;