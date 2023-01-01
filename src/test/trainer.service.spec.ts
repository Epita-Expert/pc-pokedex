import { Role, Trainer } from '@prisma/client'
import { prismaMock } from '../client/prisma.singleton'
import bcrypt from 'bcrypt'
import { CreateTrainerDto, UpdateTrainerDto } from '../dto/trainer.dto'
import TrainerService from '../services/trainer.service'

describe('TrainerService', () => {
	const mockTrainers: Trainer[] = [
		{
			id: 1,
			name: 'Ash Ketchum',
			birth: new Date('10-08-1999'),
			login: 'ashketchum',
			password: bcrypt.hashSync('pikachu', 10),
			roles: [Role.TRAINER],
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		},
		{
			id: 2,
			name: 'Leo Pokemaniac',
			birth: new Date('08-10-1999'),
			login: 'leopkmn',
			password: bcrypt.hashSync('cynthia', 10),
			roles: [Role.ADMIN],
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		},
	]

	describe('getTrainers', () => {
		it('should return trainers', async () => {
			// Mock
			prismaMock.trainer.findMany.mockResolvedValue(mockTrainers)
			// Action
			const trainers = await TrainerService.getTrainers()
			// Expect
			expect(trainers).toEqual(mockTrainers)
		})

		it('should return empty array', async () => {
			// Mock
			prismaMock.trainer.findMany.mockResolvedValue([])
			// Action
			const trainers = TrainerService.getTrainers()
			// Expect
			await expect(trainers).resolves.toEqual([])
		})
	})

	describe('getTrainerById', () => {
		it('should return trainer', async () => {
			// Mock
			prismaMock.trainer.findUnique.mockResolvedValue(mockTrainers[0])
			// Action
			const trainer = await TrainerService.getTrainerById(1)
			// Expect
			expect(trainer).toEqual(mockTrainers[0])
		})
	})

	describe('createTrainer', () => {
		it('should create trainer', async () => {
			// Mock
			prismaMock.trainer.create.mockResolvedValue(mockTrainers[0])
			// Action
			const createTrainer: CreateTrainerDto = {
				name: 'Ash Ketchum',
				birth: new Date('10-08-1999'),
				login: 'ashketchum',
				password: 'pikachu',
			}
			const trainer = await TrainerService.createTrainer(createTrainer)
			// Expect
			expect(trainer).toEqual(mockTrainers[0])
		})
	})

	describe('updateTrainer', () => {
		it('should update trainer', async () => {
			// Mock
			prismaMock.trainer.update.mockResolvedValue(mockTrainers[0])
			// Action
			const updateTrainer: UpdateTrainerDto = {
				name: 'Ash Ketchumi',
			}
			const trainer = await TrainerService.updateTrainer(1, updateTrainer)
			// Expect
			expect(trainer).toEqual(mockTrainers[0])
		})
	})

	describe('deleteTrainer', () => {
		it('should delete trainer', async () => {
			// Mock
			prismaMock.trainer.delete.mockResolvedValue(mockTrainers[0])
			// Action
			const trainer = await TrainerService.deleteTrainer(1)
			// Expect
			expect(trainer).toEqual(mockTrainers[0])
		})
	})
})
