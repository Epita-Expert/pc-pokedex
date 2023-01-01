import { Pokemon, Trade, TradesOnPokemons, TradeStatus } from '@prisma/client'
import prisma from '../client/prisma.client'
import { CreateTradeDto, UpdateTradeDto } from '../dto/trade.dto'
import HttpException from '../exceptions/http.exception'

export default class TradeService {
	public static async getTrades(): Promise<Trade[]> {
		return await prisma.trade.findMany()
	}

	public static async getTradeById(
		id: number
	): Promise<(Trade & { pokemons: TradesOnPokemons[] }) | null> {
		return await prisma.trade.findUnique({
			where: { id },
			include: {
				pokemons: true,
			},
		})
	}

	public static async createTrade(
		authorId: number,
		trade: CreateTradeDto
	): Promise<Trade> {
		const { pokemons, recipientId } = trade

		if (!pokemons.length) {
			throw new HttpException(400, 'No pokemon(s) to trade')
		}

		// Check if the author has the pokemon(s) he wants to trade
		const authorPokemons = await prisma.pokemon.findMany({
			where: {
				id: {
					in: pokemons.filter(({ sent }) => sent).map(({ id }) => id),
				},
				trainerId: authorId,
			},
		})

		// Check if the recipient has the pokemon(s) he wants to trade
		const recipientPokemons = await prisma.pokemon.findMany({
			where: {
				id: {
					in: pokemons.filter(({ sent }) => sent).map(({ id }) => id),
				},
				trainerId: recipientId,
			},
		})

		if (
			authorPokemons.length &&
			!this.compareArrays(authorPokemons, pokemons)
		) {
			throw new HttpException(
				400,
				'Author does not have the pokemon(s) he wants to trade'
			)
		}

		if (
			recipientPokemons.length &&
			!this.compareArrays(recipientPokemons, pokemons)
		) {
			throw new HttpException(
				400,
				'Recipient does not have the pokemon(s) he wants to trade'
			)
		}

		return await prisma.trade.create({
			data: {
				status: TradeStatus.PENDING,
				authorId,
				recipientId,
				pokemons: {
					createMany: {
						data: pokemons.map(({ id, sent }) => ({ sent, pokemonId: id })),
					},
				},
			},
		})
	}

	public static async updateTrade(
		tradeId: number,
		trainerId: number,
		updateTrade: UpdateTradeDto
	): Promise<Trade> {
		const trade = await prisma.trade.findUnique({
			where: { id: tradeId },
		})

		if (!trade) {
			throw new HttpException(404, 'Trade not found')
		}

		if (trade.status !== 'PENDING') {
			throw new HttpException(400, 'Only pending trade can be updated')
		}

		// Only the recipient can accept or reject a trade
		// The trainer is the authir and the update status is not pending
		if (trade.recipientId !== trainerId && updateTrade.status !== 'PENDING') {
			throw new HttpException(
				403,
				'Only the recipient can accept or reject a trade'
			)
		}

		return await prisma.trade.update({
			where: { id: tradeId },
			data: updateTrade,
		})
	}

	public static async acceptTrade(
		trade: Trade & { pokemons: TradesOnPokemons[] }
	): Promise<Trade> {
		trade.pokemons.forEach(async ({ pokemonId, sent }) => {
			if (sent) {
				await prisma.pokemon.update({
					where: { id: pokemonId },
					data: { trainerId: trade.recipientId as number },
				})
			} else {
				await prisma.pokemon.update({
					where: { id: pokemonId },
					data: { trainerId: trade.authorId as number },
				})
			}
		})

		return await prisma.trade.update({
			where: { id: trade.id },
			data: { status: TradeStatus.ACCEPTED },
		})
	}

	public static async declineTrade(trade: Trade): Promise<Trade> {
		return await prisma.trade.update({
			where: { id: trade.id },
			data: { status: TradeStatus.REFUSED },
		})
	}

	private static compareArrays(
		a: Pokemon[],
		b: {
			id: number
			sent: boolean
		}[]
	) {
		const c: number[] = a.reduce((acc, { id }) => {
			if (!acc) {
				return []
			}
			return [...acc, id]
		}, [] as number[])
		const d: number[] = b
			.filter(({ sent }) => sent)
			.reduce((acc, { id }) => [...acc, id], [] as number[])

		return (
			c.length === d.length && c.every((element, index) => element === d[index])
		)
	}
}
