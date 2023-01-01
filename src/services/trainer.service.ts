import { Trainer } from '@prisma/client'
import prisma from '../client/prisma.client'
import { ErrorCode } from '../constant'
import { CreateTrainerDto, UpdateTrainerDto } from '../dto/trainer.dto'
import HttpException from '../exceptions/http.exception'

export default class TrainerService {
	public static async getTrainers(): Promise<Trainer[]> {
		return await prisma.trainer.findMany()
	}

	public static async getTrainerById(id: number): Promise<Trainer | null> {
		const trainer = await prisma.trainer.findUnique({
			where: { id },
		})
		if (!trainer) {
			throw new HttpException(404, ErrorCode.TRAINER_NOT_FOUND)
		}
		return trainer
	}

	public static async createTrainer(
		trainer: CreateTrainerDto
	): Promise<Trainer> {
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
		const trainer = await prisma.trainer.delete({
			where: { id },
		})
		if (!trainer) {
			throw new HttpException(404, ErrorCode.TRAINER_NOT_FOUND)
		}
		return trainer
	}
}
