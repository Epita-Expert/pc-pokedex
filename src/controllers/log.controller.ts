import { Request, Response } from 'express'
import fs from 'fs'
import { ErrorCode } from '../constant'
import HttpException from '../exceptions/http.exception'
import { ErrorMiddleWare } from '../middlewares/error.middleware'
import LogService from '../services/log.service'

export default class LogController {
	public static async getLogs(
		req: Request,
		res: Response,
		next: ErrorMiddleWare
	) {
		const format = String(req.query.format)

		try {
			if (!format || !['csv'].includes(format)) {
				throw new HttpException(400, ErrorCode.INVALID_ARGUMENT)
			}
			const logs = await LogService.getLogs()
			const headers = 'id,message,createdDate,createdTime\n'
			const csv = logs.map((log) => {
				return `${log.id},${log.message},${log.createdAt.toLocaleString()}\n`
			})

			fs.writeFileSync('./logs.csv', headers + csv.join(''))
			res.setHeader('content-type', 'text/csv')
			fs.createReadStream('./logs.csv').pipe(res)
		} catch (e) {
			next(e as HttpException)
		}
	}
}
