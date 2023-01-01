import { Pokemon } from '@prisma/client'
import { Request, Response } from 'express'
import { PaginatedDto } from '../dto/paginated.dto'
import { UpdatePokemonDto } from '../dto/pokemon.dto'
import { ErrorMiddleWare } from '../middlewares/error.middleware'
import HttpException from '../exceptions/http.exception'
import PokemonService from '../services/pokemon.service'
import { ErrorCode } from '../constant'

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
				throw new HttpException(400, ErrorCode.INVALID_ARGUMENT)
			}

			const pokemons = await PokemonService.getPokemonsByTrainerId(trainerId)
			let pokemon = pokemons.find(
				(pokemon: Pokemon) => pokemon.id === pokemonId
			)
			if (!pokemon) {
				throw new HttpException(404, ErrorCode.POKEMON_NOT_FOUND)
			}

			pokemon = await PokemonService.updatePokemon(pokemonId, {
				name,
				level,
				height,
				weight,
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
				throw new HttpException(400, ErrorCode.INVALID_ARGUMENT)
			}

			const pokemon = await PokemonService.updatePokemon(pokemonId, {
				name,
				level,
				height,
				weight,
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
		const limit = parseInt(req.query.limit as string)
		const page = parseInt(req.query.page as string)
		try {
			if (isNaN(limit) || isNaN(page)) {
				throw new HttpException(400, ErrorCode.INVALID_ARGUMENT)
			}

			const pokemons = await PokemonService.getPaginatedPokemons(limit, page)
			const pokemonDto = new PaginatedDto<Pokemon>(pokemons, pokemons.length)
			return res.status(200).send(pokemonDto)
		} catch (e) {
			next(e as HttpException)
		}
	}
}
