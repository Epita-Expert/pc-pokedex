import { Trainer } from '@prisma/client'
import prisma from '../client/prisma.client'
import { CreateTrainerDto, UpdateTrainerDto } from '../dto/trainer.dto'

export default class TrainerService {
	public static async getTrainers(): Promise<Trainer[]> {
		return await prisma.trainer.findMany()
	}

	public static async getTrainerById(id: number): Promise<Trainer | null> {
		return await prisma.trainer.findUnique({
			where: { id },
		})
	}

	public static async createTrainer(trainer: CreateTrainerDto): Promise<Trainer> {
		return await prisma.trainer.create({
			data: trainer,
		})
	}

	public static async updateTrainer(
		trainerId: number,
		trainer: UpdateTrainerDto
	): Promise<Trainer> {
		return await prisma.trainer.update({
			where: { id: trainerId },
			data: trainer,
		})
	}

	public static async deleteTrainer(id: number): Promise<Trainer> {
		return await prisma.trainer.delete({
			where: { id },
		})
	}
}
