import { Request, Response } from 'express'
import LogService from '../services/log.service'

export const loggerMiddleware = (req: Request, res: Response, next: any) => {
	// console.log(`[LoggerMiddleware]: ${req.method} ${req.url}`)
	LogService.log(`[LoggerMiddleware]: ${req.method} ${req.url}`)
	next()
}
