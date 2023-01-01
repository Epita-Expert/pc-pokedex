import { TradeStatus } from '@prisma/client'
import { Request, Response } from 'express'
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
				throw new HttpException(400, 'Invalid author or recipient id')
			}

			if (authorId === recipientId) {
				throw new HttpException(400, 'You cannot trade with yourself')
			}

			if (pokemons.length < 1) {
				throw new HttpException(400, 'No pokemon selected')
			}

			for (const { id: pokemonId } of pokemons) {
				if (isNaN(pokemonId)) {
					throw new HttpException(400, 'Invalid pokemon id')
				}
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
		const trainerId = parseInt(res.locals.user.id)

		const status = req.query.status as TradeStatus

		try {
			if (isNaN(tradeId)) {
				throw new HttpException(400, 'Invalid trade id')
			}

			if (isNaN(trainerId)) {
				throw new HttpException(400, 'Invalid trainer id')
			}

			if (status && !Object.values(TradeStatus).includes(status)) {
				throw new HttpException(400, 'Invalid trade status')
			}
			const trade = await TradeService.getTradeById(tradeId)

			if (!trade) {
				throw new HttpException(404, 'Trade not found')
			}

			if (trade.recipientId !== res.locals.user.id) {
				throw new HttpException(
					403,
					'You cannot update the status of your own trade'
				)
			}

			if (trade.status !== TradeStatus.PENDING) {
				throw new HttpException(
					400,
					'You already accepted or declined this trade'
				)
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
				throw new HttpException(400, 'Invalid trade id')
			}
			const trade = await TradeService.getTradeById(tradeId)

			if (!trade) {
				throw new HttpException(404, 'Trade not found')
			}

			return res.status(200).send(trade)
		} catch (e) {
			next(e as HttpException)
		}
	}
}
