import { NextFunction, Request, Response } from 'express'
import request from 'supertest'
import app from '../app'
import { ErrorCode } from '../constant'
import TrainerService from '../services/trainer.service'

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
	describe('GET /trainers/me', () => {
		it('should return 200', async () => {
			TrainerService.getTrainerById = jest.fn().mockResolvedValueOnce({
				id: 1,
				email: '',
				password: '',
				roles: ['ADMIN'],
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			})

			const res = await request(app).get('/trainers/me')

			expect(res.statusCode).toBe(200)
			expect(res.body).toEqual({
				id: 1,
				email: '',
				password: '',
				roles: ['ADMIN'],
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
				deletedAt: null,
			})
		})
	})

	describe('PUT /trainers/me', () => {
		it('should return 200', async () => {
			TrainerService.updateTrainer = jest.fn().mockResolvedValueOnce({
				id: 1,
				email: 'hello@test.com',
				password: '',
				roles: ['ADMIN'],
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			})

			const res = await request(app).put('/trainers/me').send({
				email: 'hello@test.com',
				password: '',
			})

			expect(res.statusCode).toBe(200)
			expect(res.body).toEqual({
				id: 1,
				email: 'hello@test.com',
				password: '',
				roles: ['ADMIN'],
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
				deletedAt: null,
			})
		})
	})

	describe('DELETE /trainers/me', () => {
		it('should return 200', async () => {
			TrainerService.deleteTrainer = jest.fn().mockResolvedValueOnce({
				id: 1,
				email: '',
				password: '',
				roles: ['ADMIN'],
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: new Date(),
			})

			const res = await request(app).delete('/trainers/me')

			expect(res.statusCode).toBe(200)
		})
	})

	describe('PUT /trainers/:id', () => {
		it('should return 400', async () => {
			const res = await request(app).put('/trainers/a')

			expect(res.statusCode).toBe(400)
			expect(res.text).toBe(ErrorCode.INVALID_ARGUMENT)
		})

		it('should return 200', async () => {
			TrainerService.updateTrainer = jest.fn().mockResolvedValueOnce({
				id: 1,
				email: 'hello@test.com',
				password: '',
				roles: ['ADMIN'],
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			})

			const res = await request(app).put('/trainers/1').send({
				email: 'hello@test.com',
			})

			expect(res.statusCode).toBe(200)
		})
	})

	describe('DELETE /trainers/:id', () => {
		it('should return 400', async () => {
			const res = await request(app).delete('/trainers/a')

			expect(res.statusCode).toBe(400)
			expect(res.text).toBe(ErrorCode.INVALID_ARGUMENT)
		})

		it('should return 200', async () => {
			TrainerService.deleteTrainer = jest.fn().mockResolvedValueOnce({
				id: 1,
				email: '',
				password: '',
				roles: ['ADMIN'],
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: new Date(),
			})

			const res = await request(app).delete('/trainers/1')

			expect(res.statusCode).toBe(200)
		})
	})

	describe('GET /trainers/:id', () => {
		it('should return 400', async () => {
			const res = await request(app).get('/trainers/a')

			expect(res.statusCode).toBe(400)
			expect(res.text).toBe(ErrorCode.INVALID_ARGUMENT)
		})

		it('should return 200', async () => {
			TrainerService.getTrainerById = jest.fn().mockResolvedValueOnce({
				id: 1,
				email: '',
				password: '',
				roles: ['ADMIN'],
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			})

			const res = await request(app).get('/trainers/1')

			expect(res.statusCode).toBe(200)
			expect(res.body).toEqual({
				id: 1,
				email: '',
				password: '',
				roles: ['ADMIN'],
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
				deletedAt: null,
			})
		})
	})
})
