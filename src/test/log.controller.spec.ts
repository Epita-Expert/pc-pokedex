import { NextFunction, Request, Response } from 'express'
import request from 'supertest'
import app from '../app'
import LogService from '../services/log.service'

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

jest.mock('../services/log.service')

describe('LogController', () => {
	describe('GET /logs', () => {
		it('should return 400', async () => {
			const res = await request(app).get('/logs')

			expect(res.statusCode).toBe(400)
		})

		it('should return 200', async () => {
			LogService.getLogs = jest.fn().mockResolvedValueOnce([
				{
					id: 1,
					message: 'test message',
					createdAt: new Date(),
					updatedAt: new Date(),
					deletedAt: null,
				},
				{
					id: 2,
					message: 'test message 2',
					createdAt: new Date(),
					updatedAt: new Date(),
					deletedAt: null,
				},
			])

			const res = await request(app).get('/logs?format=csv')

			expect(res.statusCode).toBe(200)
			expect(res.headers).toHaveProperty('content-type', 'text/csv')
			// expect(res.text).toBe(
			// 	'id,message,createdAt,updatedAt,deletedAt\r\n1,test message,2021-05-01T00:00:00.000Z,2021-05-01T00:00:00.000Z,\r\n2,test message 2,2021-05-01T00:00:00.000Z,2021-05-01T00:00:00.000Z,'
			// )
		})
	})
})
