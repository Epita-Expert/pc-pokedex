import { Request, Response } from 'express'
import TrainerService from '../services/trainer.service'
import bcrypt from 'bcrypt'
import { ErrorMiddleWare } from '../middlewares/error.middleware'
import HttpException from '../exceptions/http.exception'
import { UpdateTrainerDto } from '../dto/trainer.dto'
import { ErrorCode } from '../constant'

export default class TrainerController {
	public static async updateTrainerById(
		req: Request,
		res: Response,
		next: ErrorMiddleWare
	) {
		const trainerId = parseInt(req.params.id)
		const { name, password, birth, login, roles } = req.body as UpdateTrainerDto

		try {
			if (isNaN(trainerId)) {
				throw new HttpException(400, ErrorCode.INVALID_ARGUMENT)
			}

			if (req.body.password) {
				req.body.password = bcrypt.hashSync(req.body.password, 10)
			}
			const trainer = await TrainerService.updateTrainer(trainerId, {
				name,
				password,
				birth,
				login,
				roles,
			})

			return res.status(200).send(trainer)
		} catch (e) {
			next(e as HttpException)
		}
	}

	public static async findMe(
		req: Request,
		res: Response,
		next: ErrorMiddleWare
	) {
		try {
			const trainer = await TrainerService.getTrainerById(res.locals.user.id)
			return res.status(200).send(trainer)
		} catch (e) {
			next(e as HttpException)
		}
	}

	public static async updateMe(
		req: Request,
		res: Response,
		next: ErrorMiddleWare
	) {
		if (req.body.password) {
			req.body.password = bcrypt.hashSync(req.body.password, 10)
		}
		delete req.body.roles // Prevent roles from being updated by the user

		try {
			const trainer = await TrainerService.updateTrainer(
				res.locals.user.id,
				req.body
			)
			return res.status(200).send(trainer)
		} catch (e) {
			next(e as HttpException)
		}
	}

	public static async deleteTrainerById(
		req: Request,
		res: Response,
		next: ErrorMiddleWare
	) {
		const trainerId = parseInt(req.params.id)

		try {
			if (isNaN(trainerId)) {
				throw new HttpException(400, ErrorCode.INVALID_ARGUMENT)
			}
			const trainer = await TrainerService.deleteTrainer(trainerId)
			return res.status(200).send(trainer)
		} catch (e) {
			next(e as HttpException)
		}
	}

	public static async deleteMe(
		req: Request,
		res: Response,
		next: ErrorMiddleWare
	) {
		try {
			const trainer = await TrainerService.deleteTrainer(res.locals.user.id)
			return res.status(200).send(trainer)
		} catch (e) {
			next(e as HttpException)
		}
	}

	public static async findTrainerById(
		req: Request,
		res: Response,
		next: ErrorMiddleWare
	) {
		const trainerId = parseInt(req.params.id)

		try {
			if (isNaN(trainerId)) {
				throw new HttpException(400, ErrorCode.INVALID_ARGUMENT)
			}

			const trainer = await TrainerService.getTrainerById(trainerId)
			return res.status(200).send(trainer)
		} catch (e) {
			next(e as HttpException)
		}
	}
}
