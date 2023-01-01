import { PrismaClient, Sex, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
	await prisma.trainer.upsert({
		where: { login: 'ashketchum' },
		update: {},
		create: {
			name: 'Ash Ketchum',
			birth: new Date('10-08-1999'),
			login: 'ashketchum',
			password: bcrypt.hashSync('pikachu', 10),
			roles: [Role.TRAINER],
		},
	})

	await prisma.trainer.upsert({
		where: { login: 'leopkmn' },
		update: {},
		create: {
			name: 'Leo Pokemaniac',
			birth: new Date('08-10-1999'),
			login: 'leopkmn',
			password: bcrypt.hashSync('cynthia', 10),
			roles: [Role.ADMIN],
		},
	})

	await prisma.pokemon.upsert({
		where: { id: 25 },
		update: {},
		create: {
			name: 'Pikachu',
			type: 'ELECTRIC',
			species: 'Mouse',
			level: 100,
			weight: 6,
			height: 0.4,
			chromatic: false,
			sex: Sex.MALE,
			trainer: {
				connect: {
					login: 'ashketchum',
				},
			},
		},
	})
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
