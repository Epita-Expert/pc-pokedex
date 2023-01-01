import prisma from '../client/prisma.client'
import { CreatePokemonDto, UpdatePokemonDto } from '../dto/pokemon.dto'

export default class PokemonService {
	public static async createPokemon({
		trainerId,
		name,
		level,
		height,
		weight,
		species,
		type,
		chromatic,
		sex,
	}: CreatePokemonDto) {
		const pokemon = await prisma.pokemon.create({
			data: {
				name,
				level,
				height,
				weight,
				species,
				type,
				chromatic,
				sex,
				trainer: {
					connect: {
						id: trainerId,
					},
				},
			},
		})
		return pokemon
	}

	public static async updatePokemon(
		pokemonId: number,
		{ name, level, height, weight }: UpdatePokemonDto
	) {
		const pokemon = await prisma.pokemon.update({
			where: { id: pokemonId },
			data: {
				name,
				level,
				height,
				weight,
			},
		})
		return pokemon
	}

	public static async deletePokemon(pokemonId: number) {
		const pokemon = await prisma.pokemon.delete({
			where: { id: pokemonId },
		})
		return pokemon
	}

	public static async getPokemon(pokemonId: number) {
		const pokemon = await prisma.pokemon.findUnique({
			where: { id: pokemonId },
		})
		return pokemon
	}

	public static async getPokemonsByTrainerId(trainerId: number) {
		const pokemons = await prisma.pokemon.findMany({
			where: { trainerId },
		})
		return pokemons
	}

	public static async getPaginatedPokemons(page: number, limit = 10) {
		const pokemons = await prisma.pokemon.findMany({
			skip: (page - 1) * limit,
			take: limit,
		})
		return pokemons
	}
}
