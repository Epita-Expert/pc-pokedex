import { NextFunction, Request, Response } from 'express'
import HttpException from '../exceptions/http.exception'

export type ErrorMiddleWare = (err: unknown) => void

export const errorMiddleware = (
	err: HttpException | Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof HttpException && err.status) {
		return res.status(err.status).send(err.message)
	}

	return res.status(500).send('Internal server error')
}
