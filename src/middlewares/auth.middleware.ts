import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../client/prisma.client'
import { AcceptedScopes } from '../controllers/auth.controller'

export const isAuthenticated = async (
	req: Request,
	res: Response,
	next: any
) => {
	const { authorization } = req.headers

	if (!authorization) {
		return res.status(401).send({ error: 'Authorization header is required' })
	}

	const [type, token] = authorization.split(' ')

	if (type !== 'Bearer') {
		return res
			.status(401)
			.send({ error: 'Authorization type is not supported' })
	}

	try {
		const { id, scope } = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as {
			id: number
			scope: string
		}

		const trainer = await prisma.trainer.findUnique({
			where: { id },
		})

		if (!trainer) {
			return res.status(404).send({ error: 'Trainer not found' })
		}

		res.locals.user = trainer
		res.locals.scope = scope
		next()
	} catch (e) {
		console.error(e)
		// if (e instanceof jwt.TokenExpiredError) {
		// 	return res.redirect('/')
		// }
		return res.status(500).send(e)
	}
}

export const isAdmin = async (req: Request, res: Response, next: any) => {
	console.log(res.locals.user.roles)
	if (!res.locals.user.roles.includes('ADMIN')) {
		return res
			.status(403)
			.send("You don't have permission to access this resource")
	}
	next()
}

export const hasRequiredScope = (requiredScopes: AcceptedScopes[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { scope } = res.locals
		const scopes = scope.split(' ')
		const hasScope = requiredScopes.every((requiredScope) =>
			scopes.includes(requiredScope)
		)

		if (!hasScope) {
			return res.status(403).send({ error: 'Scope is not allowed' })
		}

		next()
	}
}
