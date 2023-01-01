import { Role } from '@prisma/client'
import request from 'supertest'
import app from '../app'
import { prismaMock } from '../client/prisma.singleton'

describe('AuthController', () => {
	describe('register', () => {
		it('should return 200', async () => {
			prismaMock.trainer.create.mockResolvedValueOnce({
				id: 1,
				name: 'test',
				birth: new Date('1990-01-01'),
				login: 'test',
				password: 'test',
				roles: [Role.TRAINER],
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			})

			const res = await request(app).post('/auth/register').send({
				name: 'test',
				birth: '1990-01-01',
				login: 'test',
				password: 'test',
			})
			expect(res.statusCode).toBe(200)
			expect(res.body).toEqual({
				id: expect.any(Number),
				name: 'test',
				birth: new Date('1990-01-01').toISOString(),
				login: 'test',
				password: expect.any(String),
				roles: ['TRAINER'],
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
				deletedAt: null,
			})
		})

		it('should return 422', async () => {
			const res = await request(app).post('/auth/register').send({
				birth: '1990-01-01',
				login: 'test',
				password: 'test',
			})

			expect(res.statusCode).toBe(422)

			expect(res.body).toHaveProperty('error')
		})

		it('should return 409', async () => {
			prismaMock.trainer.create.mockRejectedValueOnce({ code: 'P2002' })

			const res = await request(app).post('/auth/register').send({
				name: 'test',
				birth: '1990-01-01',
				login: 'test',
				password: 'test',
			})

			expect(res.statusCode).toBe(409)

			expect(res.body).toHaveProperty('error')
		})
	})
})
