import { NextFunction, Request, Response } from 'express'
import request from 'supertest'
import app from '../app'
import { ErrorCode } from '../constant'
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

describe('TradeController', () => {

	beforeAll(() => {
		jest.resetAllMocks()
	})

	describe('POST /', () => {
		it('should return 400', async () => {
			const res = await request(app).post('/trades').send({
				recipientId: 'a',
				pokemons: [],
			})

			expect(res.statusCode).toBe(400)
			expect(res.text).toBe(ErrorCode.INVALID_ARGUMENT)
		})

		it('should return 200', async () => {
			TradeService.createTrade = jest.fn().mockResolvedValueOnce({
				recipientId: 2,
				pokemons: [1],
			})

			const res = await request(app)
				.post('/trades')
				.send({
					recipientId: 2,
					pokemons: [1],
				})

			expect(res.statusCode).toBe(200)
			expect(res.body).toEqual({
				recipientId: 2,
				pokemons: [1],
			})
		})
	})

	describe('GET /:id', () => {
		it('should return 400', async () => {
			const res = await request(app).get('/trades/a')

			expect(res.statusCode).toBe(400)
			expect(res.text).toBe(ErrorCode.INVALID_ARGUMENT)
		})

		it('should return 200', async () => {
			TradeService.getTradeById = jest.fn().mockResolvedValueOnce({
				id: 1,
				recipientId: 2,
				pokemons: [1],
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			})

			const res = await request(app).get('/trades/1')

			expect(res.statusCode).toBe(200)
			expect(res.body).toEqual({
				id: 1,
				recipientId: 2,
				pokemons: [1],
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
				deletedAt: null,
			})
		})
	})

	describe('PUT /:id/:status', () => {
		it('should return 400', async () => {
			const res = await request(app).put('/trades/a/ACCEPTED')

			expect(res.statusCode).toBe(400)
			expect(res.text).toBe(ErrorCode.INVALID_ARGUMENT)
		})

		it('should return 400', async () => {
			const res = await request(app).put('/trades/1/STATUS_THAT_DOES_NOT_EXIST')

			expect(res.statusCode).toBe(400)
			expect(res.text).toBe(ErrorCode.INVALID_TRADE_STATUS)
		})

		it('should return 400', async () => {
			TradeService.getTradeById = jest.fn().mockResolvedValueOnce({
				id: 1,
				status: 'ACCEPTED',
				recipientId: 2,
				pokemons: [1],
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			})

			const res = await request(app).put('/trades/1/REFUSED')

			expect(res.statusCode).toBe(400)
			expect(res.text).toBe(ErrorCode.TRADE_ALREADY_ACCEPTED_OR_DECLINED)
		})

		it('should return 400', async () => {
			TradeService.getTradeById = jest.fn().mockResolvedValueOnce({
				id: 1,
				status: 'PENDING',
				recipientId: 2,
				pokemons: [1],
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			})

			const res = await request(app).put('/trades/1/ACCEPTED')

			expect(res.statusCode).toBe(403)
			expect(res.text).toBe(ErrorCode.CANT_ACCEPT_YOUR_OWN_TRADE)
		})

		it('should return 200', async () => {
			TradeService.getTradeById = jest.fn().mockResolvedValueOnce({
				id: 1,
				status: 'PENDING',
				recipientId: 1,
				pokemons: [1],
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			})

			TradeService.acceptTrade = jest.fn().mockResolvedValueOnce({
				id: 1,
				status: 'ACCEPTED',
				recipientId: 1,
				pokemons: [1],
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			})

			const res = await request(app).put('/trades/1/ACCEPTED')

			expect(res.statusCode).toBe(200)
			expect(res.body).toEqual({
				id: 1,
				status: 'ACCEPTED',
				recipientId: 1,
				pokemons: [1],
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
				deletedAt: null,
			})
		})

		// it('should return 200', async () => {
		// 	TradeService.getTradeById = jest.fn().mockResolvedValueOnce({
		// 		id: 1,
		// 		status: 'PENDING',
		// 		recipientId: 1,
		// 		pokemons: [1],
		// 		createdAt: new Date(),
		// 		updatedAt: new Date(),
		// 		deletedAt: null,
		// 	})

		// 	TradeService.acceptTrade = jest.fn().mockResolvedValueOnce({
		// 		id: 1,
		// 		status: 'REFUSED',
		// 		recipientId: 1,
		// 		pokemons: [1],
		// 		createdAt: new Date(),
		// 		updatedAt: new Date(),
		// 		deletedAt: null,
		// 	})

		// 	const res = await request(app).put('/trades/1/REFUSED')

		// 	expect(res.statusCode).toBe(200)
		// 	expect(res.body).toEqual({
		// 		id: 1,
		// 		status: 'REFUSED',
		// 		recipientId: 1,
		// 		pokemons: [1],
		// 		createdAt: expect.any(String),
		// 		updatedAt: expect.any(String),
		// 		deletedAt: null,
		// 	})
		// })
	})
})
