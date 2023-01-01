import { Log } from '@prisma/client'
import prisma from '../client/prisma.client'

export default class LogService {
	public static async log(message: string): Promise<void> {
		await prisma.log.create({
			data: {
				message,
			},
		})
		return
	}

	public static async getLogs(): Promise<Log[]> {
		const logs = await prisma.log.findMany()
		return logs
	}
}
