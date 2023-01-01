import { TradeStatus } from '@prisma/client'
import { Request, Response } from 'express'
import { ErrorCode } from '../constant'
import { CreateTradeDto } from '../dto/trade.dto'
import HttpException from '../exceptions/http.exception'
import { ErrorMiddleWare } from '../middlewares/error.middleware'
import TradeService from '../services/trade.services'

export default class TradeController {
	public static async createTrade(
		req: Request,
		res: Response,
		next: ErrorMiddleWare
	) {
		const { pokemons, recipientId } = req.body as CreateTradeDto
		const authorId = parseInt(res.locals.user.id)

		try {
			if (isNaN(authorId) || isNaN(recipientId)) {
				throw new HttpException(400, ErrorCode.INVALID_ARGUMENT)
			}

			const trade = await TradeService.createTrade(authorId, {
				recipientId,
				pokemons,
			})
			return res.status(200).send(trade)
		} catch (e) {
			next(e as HttpException)
		}
	}

	public static async updateTradeById(
		req: Request,
		res: Response,
		next: ErrorMiddleWare
	) {
		const tradeId = parseInt(req.params.id)
		const status = req.params.status as TradeStatus
		const trainerId = parseInt(res.locals.user.id)

		try {
			if (isNaN(tradeId) || isNaN(trainerId)) {
				throw new HttpException(400, ErrorCode.INVALID_ARGUMENT)
			}

			if (status && !Object.values(TradeStatus).includes(status)) {
				throw new HttpException(400, ErrorCode.INVALID_TRADE_STATUS)
			}
			const trade = await TradeService.getTradeById(tradeId)

			if (trade.status !== TradeStatus.PENDING) {
				throw new HttpException(
					400,
					ErrorCode.TRADE_ALREADY_ACCEPTED_OR_DECLINED
				)
			}

			if (trade.recipientId !== res.locals.user.id) {
				throw new HttpException(403, ErrorCode.CANT_ACCEPT_YOUR_OWN_TRADE)
			}

			let tradeUpdated = null
			if (status === TradeStatus.ACCEPTED) {
				tradeUpdated = await TradeService.acceptTrade(trade)
			} else if (status === TradeStatus.REFUSED) {
				tradeUpdated = await TradeService.declineTrade(trade)
			}
			return res.status(200).send(tradeUpdated ?? trade)
		} catch (e) {
			next(e as HttpException)
		}
	}

	public static async findTradeById(
		req: Request,
		res: Response,
		next: ErrorMiddleWare
	) {
		const tradeId = parseInt(req.params.id)

		try {
			if (isNaN(tradeId)) {
				throw new HttpException(400, ErrorCode.INVALID_ARGUMENT)
			}
			const trade = await TradeService.getTradeById(tradeId)

			return res.status(200).send(trade)
		} catch (e) {
			next(e as HttpException)
		}
	}
}
