import { Router } from 'express'
import PokemonController from '../controllers/pokemon.controller'
import { isAdmin } from '../middlewares/auth.middleware'

const router = Router()

/*
 * PUT /pokemons/:id/me
 * Update my pokemon
 * @body {UpdatePokemonDto} pokemon
 * @return {Pokemon} pokemon
 */
router.put('/:id/me', PokemonController.updateMyPokemon)

/*
 * PUT /pokemons/:id
 * Update pokemon by id
 * @param {number} id
 * @body {UpdatePokemonDto} pokemon
 * @return {Pokemon} pokemon
 */

router.put('/:id', isAdmin, PokemonController.updatePokemon)

/*
 * GET /pokemons
 * Get all pokemons
 * @return {pokemonDto} pokemons
 */
router.get('/', PokemonController.getPokemons)

export default router
