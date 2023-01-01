import { Pokemon, Sex } from '@prisma/client'
import { prismaMock } from '../client/prisma.singleton'
import PokemonService from '../services/pokemon.service'

describe('PokemonService', () => {
	describe('getPokemon', () => {
		it('should return a pokemon', async () => {
			const expectedPokemon: Pokemon = {
				id: 1,
				name: 'Bulbasaur',
				type: 'Grass',
				chromatic: false,
				height: 0.7,
				weight: 6.9,
				level: 1,
				species: 'Seed',
				sex: Sex.MALE,
				tradesId: null,
				trainerId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			}

			prismaMock.pokemon.findUnique.mockResolvedValue(expectedPokemon)

			const pokemon = PokemonService.getPokemon(1)
			await expect(pokemon).resolves.toEqual(expectedPokemon)
		})
	})

	describe('createPokemon', () => {
		it('should return pokemons', async () => {
			const expectedPokemons: Pokemon = {
				id: 1,
				name: 'Bulbasaur',
				type: 'Grass',
				chromatic: false,
				height: 0.7,
				weight: 6.9,
				level: 1,
				species: 'Seed',
				sex: Sex.MALE,
				tradesId: null,
				trainerId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			}

			prismaMock.pokemon.create.mockResolvedValue(expectedPokemons)

			const pokemons = PokemonService.createPokemon({
				name: 'Bulbasaur',
				type: 'Grass',
				chromatic: false,
				height: 0.7,
				weight: 6.9,
				level: 1,
				species: 'Seed',
				sex: Sex.MALE,
				trainerId: 1,
			})
			await expect(pokemons).resolves.toEqual(expectedPokemons)
		})
	})
})
