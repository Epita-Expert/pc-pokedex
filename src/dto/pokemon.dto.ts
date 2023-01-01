import { Sex } from '@prisma/client'

export class CreatePokemonDto {
	species: string
	name: string | null
	type: string
	level: number
	weight: number
	height: number
	chromatic: boolean
	trainerId: number
	sex: Sex
}

export class UpdatePokemonDto {
	name?: string
	level?: number
	weight?: number
	height?: number
}
