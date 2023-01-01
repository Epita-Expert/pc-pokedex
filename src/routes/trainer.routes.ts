import { Router } from 'express'
import TrainerController from '../controllers/trainer.controller'
import { isAdmin } from '../middlewares/auth.middleware'

const router = Router()

/*
* GET /trainer/me
* Get me
*
* @return {Trainer}
*/
router.get('/me', TrainerController.findMe)
/*
* PUT /trainer/me
* Update me
* @body {UpdateTrainerDto}
*
* @return {Trainer}
*/
router.put('/me', TrainerController.updateMe)

/*
 * DELETE /trainer/me
* Delete me
 * @return {Trainer}
 */
router.delete('/me', TrainerController.deleteMe)
/*
 * PUT /trainer/:id
 * Update trainer by id
 * @param {number} id
 * @body {UpdateTrainerDto}
 *
 * @return {Trainer}
 */
router.put('/:id', isAdmin, TrainerController.updateTrainerById)
/*
 * DELETE /trainer/:id
 * Delete trainer by id
 * @param {number} id
 * @return {Trainer}
 */
router.delete('/:id', isAdmin, TrainerController.deleteTrainerById)

/*
 * GET /trainer/:id
 * Get trainer by id
 * @param {number} id
 * @return {Trainer}
 */
router.get('/:id', TrainerController.findTrainerById)

export default router
