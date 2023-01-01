import request from 'supertest'
import app from '../app'
import { ErrorCode } from '../constant'

describe('AppController', () => {
	describe('GET /', () => {
		it('should return 200', async () => {
			const res = await request(app).get('/')

			expect(res.statusCode).toBe(404)
			expect(res.text).toBe(ErrorCode.NOT_FOUND)
		})
	})
})
