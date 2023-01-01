
import { Router } from 'express'
import { AcceptedScopes } from '../controllers/auth.controller'
import LogController from '../controllers/log.controller'
import { hasRequiredScope, isAdmin } from '../middlewares/auth.middleware'

const router = Router()
/*
 * GET /log
 * Get all logs
 * @query {string} format
 * @return {File}
 */
router.get('/', hasRequiredScope([AcceptedScopes['read:log']]), isAdmin, LogController.getLogs)

export default router
