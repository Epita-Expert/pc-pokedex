import { Pokemon, Trade, TradesOnPokemons, TradeStatus } from '@prisma/client'
import prisma from '../client/prisma.client'
import { ErrorCode } from '../constant'
import { CreateTradeDto } from '../dto/trade.dto'
import HttpException from '../exceptions/http.exception'

export default class TradeService {
	public static async getTrades(): Promise<Trade[]> {
		return await prisma.trade.findMany()
	}

	public static async getTradeById(
		id: number
	): Promise<Trade & { pokemons: TradesOnPokemons[] }> {
		const trade = await prisma.trade.findUnique({
			where: { id },
			include: { pokemons: true },
		})
		if (!trade) {
			throw new HttpException(404, ErrorCode.TRADE_NOT_FOUND)
		}
		return trade
	}

	public static async createTrade(
		authorId: number,
		trade: CreateTradeDto
	): Promise<Trade> {
		const { pokemons, recipientId } = trade

		for (const { id: pokemonId } of pokemons) {
			if (isNaN(pokemonId)) {
				throw new HttpException(400, ErrorCode.INVALID_ARGUMENT)
			}
		}

		if (authorId === recipientId) {
			throw new HttpException(400, ErrorCode.CANT_TRADE_WITH_YOURSELF)
		}

		if (!pokemons.length) {
			throw new HttpException(400, ErrorCode.INVALID_POKEMON_TO_TRADE)
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
			throw new HttpException(400, ErrorCode.INVALID_POKEMON_TO_TRADE)
		}

		if (
			recipientPokemons.length &&
			!this.compareArrays(recipientPokemons, pokemons)
		) {
			throw new HttpException(400, ErrorCode.INVALID_POKEMON_TO_TRADE)
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
