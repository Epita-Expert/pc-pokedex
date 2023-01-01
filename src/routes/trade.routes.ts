import { Router } from 'express'
import TradeController from '../controllers/trade.controller'

const router = Router()
/*
 * POST /trade
 * Create trade
 * @body {CreateTradeDto} trade
 * @return {Trade} trade
 */
router.post('/', TradeController.createTrade)

/*
 * PUT /trade/:id
 * Update trade by id
 * @param {number} id
 * @query {TradeStatus} status
 * @return {Trade}
 */
router.put('/:id/:status', TradeController.updateTradeById)

/*
 * GET /trade/:id
 * Get trade by id
 * @param {number} id
 * @return {Trade}
 */
router.get('/:id', TradeController.findTradeById)

export default router
