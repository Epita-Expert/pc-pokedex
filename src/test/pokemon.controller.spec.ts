import { NextFunction, Request, Response } from 'express'
import request from 'supertest'
import app from '../app'
import { ErrorCode } from '../constant'
import PokemonService from '../services/pokemon.service'

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

describe('PokemonController', () => {
	describe('GET /', () => {
		it('should return 400', async () => {
			const res = await request(app).get('/pokemons?limit=a&page=0')

			expect(res.statusCode).toBe(400)
			expect(res.text).toBe(ErrorCode.INVALID_ARGUMENT)
		})
		it('should return 400', async () => {
			const res = await request(app).get('/pokemons?limit=10&page=b')

			expect(res.statusCode).toBe(400)
			expect(res.text).toBe(ErrorCode.INVALID_ARGUMENT)
		})

		it('should return 200', async () => {
			PokemonService.getPaginatedPokemons = jest.fn().mockResolvedValueOnce({
				total: 0,
				data: [],
			})

			const res = await request(app).get('/pokemons?limit=10&page=0')

			expect(res.statusCode).toBe(200)
			expect(res.body).toEqual({ data: { data: [], total: 0 } })
		})
	})

	describe('PUT /:id', () => {
		it('should return 400', async () => {
			const res = await request(app).put('/pokemons/a')

			expect(res.statusCode).toBe(400)
			expect(res.text).toBe(ErrorCode.INVALID_ARGUMENT)
		})

		it('should return 200', async () => {
			PokemonService.updatePokemon = jest.fn().mockResolvedValueOnce({
				id: 1,
				name: 'Pikachu',
			})

			const res = await request(app).put('/pokemons/1')

			expect(res.statusCode).toBe(200)
			expect(res.body).toEqual({
				id: 1,
				name: 'Pikachu',
			})
		})
	})

	describe('PUT /:id/me', () => {
		it('should return 400', async () => {
			const res = await request(app).put('/pokemons/a/me')
			expect(res.statusCode).toBe(400)
			expect(res.text).toBe(ErrorCode.INVALID_ARGUMENT)
		})

		it('should return 404', async () => {
			PokemonService.getPokemonsByTrainerId = jest.fn().mockResolvedValueOnce([
				{
					id: 2,
				},
			])

			const res = await request(app).put('/pokemons/1/me')
			expect(res.statusCode).toBe(404)
			expect(res.text).toBe(ErrorCode.POKEMON_NOT_FOUND)
		})

		it('should return 200', async () => {
			PokemonService.getPokemonsByTrainerId = jest.fn().mockResolvedValueOnce([
				{
					id: 1,
					name: 'Pikachu',
				},
			])
			PokemonService.updatePokemon = jest.fn().mockResolvedValueOnce({
				id: 1,
				name: 'Pikachou',
			})

			const res = await request(app).put('/pokemons/1/me')
			expect(res.statusCode).toBe(200)
			expect(res.body).toEqual({
				id: 1,
				name: 'Pikachou',
			})
		})
	})

	describe
})
