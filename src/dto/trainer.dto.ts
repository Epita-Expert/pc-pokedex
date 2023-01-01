import { Role } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateTrainerDto {
	@IsString()
	@IsNotEmpty()
	name: string
	@IsString()
	@IsNotEmpty()
	login: string
	@IsString()
	@IsNotEmpty()
	password: string
	@IsString()
	@IsNotEmpty()
	birth: Date
}

export class UpdateTrainerDto {
	name?: string
	login?: string
	password?: string
	birth?: Date
	roles?: Role[]
}
