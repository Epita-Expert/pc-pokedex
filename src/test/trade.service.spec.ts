import { Sex, TradeStatus } from '@prisma/client'
import { prismaMock } from '../client/prisma.singleton'
import { ErrorCode } from '../constant'
import { CreateTradeDto } from '../dto/trade.dto'
import HttpException from '../exceptions/http.exception'
import TradeService from '../services/trade.services'

describe('TradeService', () => {
	describe('getTrades', () => {
		it('should return a list of trades', async () => {
			const date = new Date()
			const expectedTrades = [
				{
					id: 1,
					status: TradeStatus.PENDING,
					authorId: 1,
					recipientId: 2,
					pokemonIds: [1, 2, 3],
					createdAt: date,
					updatedAt: date,
					deletedAt: null,
				},
				{
					id: 2,
					status: TradeStatus.PENDING,
					authorId: 2,
					recipientId: 1,
					pokemonIds: [4, 5, 6],
					createdAt: date,
					updatedAt: date,
					deletedAt: null,
				},
			]

			prismaMock.trade.findMany.mockResolvedValue(expectedTrades)

			const trades = TradeService.getTrades()
			await expect(trades).resolves.toEqual(expectedTrades)
		})
	})

	describe('getTradeById', () => {
		it('should return a trade', async () => {
			const date = new Date()
			const expectedTrade = {
				id: 1,
				status: TradeStatus.PENDING,
				authorId: 1,
				recipientId: 2,
				pokemonIds: [1, 2, 3],
				createdAt: date,
				updatedAt: date,
				deletedAt: null,
			}

			prismaMock.trade.findUnique.mockResolvedValue(expectedTrade)

			const trade = TradeService.getTradeById(1)
			await expect(trade).resolves.toEqual(expectedTrade)
		})
	})

	describe('createTrade', () => {
		it('should create a trade', async () => {
			const creationDate = new Date()
			const expectedTrade = {
				id: 1,
				status: TradeStatus.PENDING,
				authorId: 1,
				recipientId: 2,
				pokemonIds: [1, 2, 3],
				createdAt: creationDate,
				updatedAt: creationDate,
				deletedAt: null,
			}
			const authorId = 1
			const createTrade: CreateTradeDto = {
				recipientId: 2,
				pokemons: [
					{ id: 1, sent: true },
					{ id: 2, sent: false },
				],
			}
			prismaMock.pokemon.findMany.mockResolvedValue([
				{
					id: 1,
					name: 'Bulbasaur',
					type: 'Grass',
					species: 'Seed',
					level: 1,
					weight: 6.9,
					height: 0.7,
					chromatic: false,
					sex: Sex.MALE,
					createdAt: creationDate,
					updatedAt: creationDate,
					deletedAt: null,
					tradesId: null,
					trainerId: 1,
				},
			])

			prismaMock.trade.create.mockResolvedValue(expectedTrade)

			const trade = TradeService.createTrade(authorId, createTrade)
			await expect(trade).resolves.toEqual(expectedTrade)
		})

		it('should error invalid argument', async () => {
			const authorId = 1
			const createTrade: CreateTradeDto = {
				recipientId: 2,
				pokemons: [],
			}
			prismaMock.pokemon.findMany.mockResolvedValue([])

			const trade = TradeService.createTrade(authorId, createTrade)
			await expect(trade).rejects.toThrowError(new HttpException(400, ErrorCode.INVALID_POKEMON_TO_TRADE))
		})

		it('should error "Author does not have the pokemon(s) he wants to trade"', async () => {
			const date = new Date()
			const authorId = 1
			const createTrade: CreateTradeDto = {
				recipientId: 2,
				pokemons: [
					{ id: 3, sent: true },
					{ id: 2, sent: false },
				],
			}

			// Author has pokemon 2 and recipient has pokemon 1
			prismaMock.pokemon.findMany
				.mockResolvedValueOnce([
					{
						id: 1,
						name: 'Bulbasaur',
						type: 'Grass',
						trainerId: 2,
						sex: Sex.MALE,
						species: 'Seed',
						chromatic: false,
						height: 7,
						weight: 69,
						level: 1,
						createdAt: date,
						updatedAt: date,
						deletedAt: null,
						tradesId: null,
					},
				])
				.mockResolvedValueOnce([
					{
						id: 2,
						name: 'Charmander',
						type: 'Fire',
						trainerId: 1,
						sex: Sex.MALE,
						species: 'Lizard',
						chromatic: false,
						height: 6,
						weight: 85,
						level: 1,
						createdAt: date,
						updatedAt: date,
						deletedAt: null,
						tradesId: null,
					},
				])

			const trade = TradeService.createTrade(authorId, createTrade)
			await expect(trade).rejects.toThrowError(new HttpException(400, ErrorCode.INVALID_POKEMON_TO_TRADE))
		})

		it('should error "Recipient does not have the pokemon(s) you wants to trade"', async () => {
			const date = new Date()
			const authorId = 1

			const createTrade: CreateTradeDto = {
				recipientId: 2,
				pokemons: [
					{ id: 1, sent: true },
					{ id: 3, sent: false },
				],
			}

			// Author has pokemon 2 and recipient has pokemon 1
			prismaMock.pokemon.findMany
				.mockResolvedValueOnce([
					{
						id: 1,
						name: 'Bulbasaur',
						type: 'Grass',
						trainerId: 1,
						sex: Sex.MALE,
						species: 'Seed',
						chromatic: false,
						height: 7,
						weight: 69,
						level: 1,
						createdAt: date,
						updatedAt: date,
						deletedAt: null,
						tradesId: null,
					},
				])
				.mockResolvedValueOnce([
					{
						id: 2,
						name: 'Charmander',
						type: 'Fire',
						trainerId: 1,
						sex: Sex.MALE,
						species: 'Lizard',
						chromatic: false,
						height: 6,
						weight: 85,
						level: 1,
						createdAt: date,
						updatedAt: date,
						deletedAt: null,
						tradesId: null,
					},
				])

			const trade = TradeService.createTrade(authorId, createTrade)
			await expect(trade).rejects.toThrowError(new HttpException(400, ErrorCode.INVALID_POKEMON_TO_TRADE))
		})
	})
})

// prismaMock.logs.findMany.mockResolvedValueOnce(logs);
// await expect(logService.getLogs()).resolves.toEqual(logs);
