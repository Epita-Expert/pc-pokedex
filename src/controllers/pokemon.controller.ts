import { Pokemon } from '@prisma/client'
import { Request, Response } from 'express'
import prisma from '../client/prisma.client'
import { PaginatedDto } from '../dto/paginated.dto'
import { UpdatePokemonDto } from '../dto/pokemon.dto'
import { ErrorMiddleWare } from '../middlewares/error.middleware'
import HttpException from '../exceptions/http.exception'

export default class PokemonController {
	public static async updateMyPokemon(
		req: Request,
		res: Response,
		next: ErrorMiddleWare
	) {
		const pokemonId = parseInt(req.params.id)
		const trainerId = res.locals.user.id
		const { name, level, height, weight } = req.body as UpdatePokemonDto

		try {
			if (isNaN(pokemonId)) {
				throw new HttpException(400, 'Invalid pokemon id')
			}

			const pokemons = await prisma.pokemon.findMany({ where: { trainerId } })
			let pokemon = pokemons.find(
				(pokemon: Pokemon) => pokemon.id === pokemonId
			)
			if (!pokemon) {
				throw new HttpException(404, 'Pokemon not found')
			}

			pokemon = await prisma.pokemon.update({
				where: { id: pokemonId },
				data: {
					name,
					level,
					height,
					weight,
				},
			})

			return res.status(200).send(pokemon)
		} catch (e) {
			next(e as HttpException)
		}
	}

	public static async updatePokemon(
		req: Request,
		res: Response,
		next: ErrorMiddleWare
	) {
		const pokemonId = parseInt(req.params.id)
		const { name, level, height, weight } = req.body as UpdatePokemonDto

		try {
			if (isNaN(pokemonId)) {
				throw new HttpException(400, 'Invalid pokemon id')
			}
			const pokemon = await prisma.pokemon.update({
				where: { id: pokemonId },
				data: {
					name,
					level,
					height,
					weight,
				},
			})

			return res.status(200).send(pokemon)
		} catch (e) {
			next(e as HttpException)
		}
	}

	public static async getPokemons(
		req: Request,
		res: Response,
		next: ErrorMiddleWare
	) {
		try {
			const pokemons = await prisma.pokemon.findMany()
			const pokemonDto = new PaginatedDto<Pokemon>(pokemons, pokemons.length)
			return res.status(200).send(pokemonDto)
		} catch (e) {
			next(e as HttpException)
		}
	}
}
