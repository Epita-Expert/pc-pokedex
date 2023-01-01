import { Sex, TradeStatus } from '@prisma/client'
import { Request, Response, NextFunction } from 'express'
import { prismaMock } from '../client/prisma.singleton'
import { CreateTradeDto, UpdateTradeDto } from '../dto/trade.dto'
import TradeService from '../services/trade.services'

jest.mock('../middlewares/auth.middleware', () => ({
	isAuthenticated: (req: Request, res: Response, next: NextFunction) => {
		res.locals.user = {
			id: 1,
			email: '',
			password: '',
			roles: ['ADMIN'],
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		}
		next()
	},
	isAdmin: (_: any, __: any, next: NextFunction) => {
		next()
	},
	hasRequiredScope: () => {
		return (_: any, __: any, next: NextFunction) => {
			next()
		}
	},
}))

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
			await expect(trade).rejects.toThrowError('No pokemon(s) to trade')
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
			await expect(trade).rejects.toThrowError(
				'Author does not have the pokemon(s) he wants to trade'
			)
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
			await expect(trade).rejects.toThrowError(
				'Recipient does not have the pokemon(s) he wants to trade'
			)
		})
	})

	describe('updateTrade', () => {
		it('should update a trade', async () => {
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
			prismaMock.trade.update.mockResolvedValue(expectedTrade)

			const trade = TradeService.updateTrade(1, 1, expectedTrade)
			await expect(trade).resolves.toEqual(expectedTrade)
		})

		it("should error 'Trade not found'", async () => {
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

			prismaMock.trade.findUnique.mockResolvedValue(null)

			const trade = TradeService.updateTrade(1, 1, expectedTrade)
			await expect(trade).rejects.toThrowError('Trade not found')
		})

		it("should error 'Only pending trades can be updated'", async () => {
			const date = new Date()
			const expectedTrade = {
				id: 1,
				status: TradeStatus.ACCEPTED,
				authorId: 1,
				recipientId: 2,
				pokemonIds: [1, 2, 3],
				createdAt: date,
				updatedAt: date,
				deletedAt: null,
			}

			prismaMock.trade.findUnique.mockResolvedValue(expectedTrade)

			const trade = TradeService.updateTrade(1, 1, expectedTrade)
			await expect(trade).rejects.toThrowError(
				'Only pending trade can be updated'
			)
		})

		it("should error 'Only the recipient can accept or reject a trade'", async () => {
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

			const trade = TradeService.updateTrade(1, 1, {
				status: TradeStatus.ACCEPTED,
			})
			await expect(trade).rejects.toThrowError(
				'Only the recipient can accept or reject a trade'
			)
		})
	})
})

// prismaMock.logs.findMany.mockResolvedValueOnce(logs);
// await expect(logService.getLogs()).resolves.toEqual(logs);
