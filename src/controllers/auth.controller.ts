import { Role } from '@prisma/client'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../client/prisma.client'
import { CreateTrainerDto } from '../dto/trainer.dto'
import { validate } from 'class-validator'

const routerName = 'AuthController'

const acceptedScopes = [
	'write:me',
	'read:trainer',
	'write:trainer',
	'read:pokemon',
	'write:pokemon',
	'write:trade',
	'read:log',
]

export enum AcceptedScopes {
	'write:me' = 'write:me',
	'read:trainer' = 'read:trainer',
	'write:trainer' = 'write:trainer',
	'read:pokemon' = 'read:pokemon',
	'write:pokemon' = 'write:pokemon',
	'write:trade' = 'write:trade',
	'read:log' = 'read:log',
}

type AuthorizeQuery = {
	client_id: string
	redirect_uri: string
	response_type: string
	scope: string
	state?: string
}

type AuthorizeBody = {
	client_id: string
	redirect_uri: string
	response_type: string
	scope: string
	state?: string
	login?: string
	password?: string
}

type TokenBody = {
	grant_type: string
	code: string
	redirect_uri: string
	client_id: string
	client_secret: string
}

type EncodedToken = {
	login: string
	scope: string
}
export default class AuthController {
	public static async register(
		req: Request,
		res: Response,
	) {
		// console.log(`[${routerName}] /register`, req.body)

		const createTrainerDto = new CreateTrainerDto()
		Object.assign(createTrainerDto, req.body)
		const errors = await validate(createTrainerDto)
		if (errors.length > 0) {
			// console.log(errors)
			return res.status(422).send({
				error: errors.map((error) => ({
					[error.property]: error.constraints,
				})),
			})
		}

		const { name, birth, login, password } = req.body as CreateTrainerDto

		try {
			const user = await prisma.trainer.create({
				data: {
					name,
					login,
					password: bcrypt.hashSync(password, 10),
					birth: new Date(birth),
					roles: [Role.TRAINER],
				},
			})
			return res.status(200).send(user)
		} catch (e: any) {
			// console.error(e)
			if (e.code === 'P2002') {
				return res
					.status(409)
					.send({ error: [{ message: 'Login already exists' }] })
			}
			return res.status(500).send()
		}
	}

	public static async getAuthorize(
		req: Request,
		res: Response,
	) {
		const { client_id, redirect_uri, response_type, scope, state } =
			req.query as AuthorizeQuery
		console.debug('[GET] /authorize', req.query)
		if (client_id !== process.env.OAUTH_CLIENT_ID) {
			return res.status(401).send('Application is not authorized')
		}
		if (!redirect_uri) {
			return res.status(400).send('Redirect URI is required')
		}

		if (response_type !== 'code') {
			return res.status(400).send('Response type is not accepted')
		}

		if (!scope) {
			return res.status(400).send('No scope provided')
		}

		const scopes = scope.split(' ')
		for (const scope of scopes) {
			if (!acceptedScopes.includes(scope)) {
				return res.status(400).send(`Scope is not accepted (${scope})`)
			}
		}
		return res.status(200).send(`
	<!DOCTYPE html>
	<html>
		<body>
			<h1>Authorize</h1>
			<form action="/auth/authorize" method="post">
				<input type="hidden" name="redirect_uri" value="${redirect_uri}" />
				<input type="hidden" name="scope" value="${scope}" />
				<input type="hidden" name="state" value="${state}" />
				<input type="text" name="login" placeholder="Login" value="leopkmn"/>
				<input type="password" name="password" placeholder="Password" value="cynthia"/>
				<input type="submit" value="Authorize" />
			</form>
		</body>
	</html>
	
	`)
	}

	public static async postAuthorize(
		req: Request,
		res: Response,
	) {
		const { redirect_uri, scope, state, login, password } =
			req.body as AuthorizeBody
		console.debug('[POST] /authorize', req.body)

		if (!login || !password) {
			return res.status(400).send('Login and password are required')
		}

		const user = await prisma.trainer.findUnique({
			where: { login },
		})
		if (!user) {
			return res.status(404).send('User not found')
		}

		if (!bcrypt.compareSync(password, user.password)) {
			return res.status(401).send('Invalid password')
		}

		const code = jwt.sign({ login, scope }, process.env.JWT_SECRET as string, {
			expiresIn: 5000,
		})
		const url = `${redirect_uri}?code=${code}&state=${state}`
		console.log(`[${routerName}] Redirecting: ${url}`)

		return res.redirect(`${url}`)
	}

	public static async token(
		req: Request,
		res: Response,
	) {
		const { code, client_id, client_secret } = req.body as TokenBody

		console.log('/token', req.body)

		if (
			client_id !== process.env.OAUTH_CLIENT_ID ||
			client_secret !== process.env.OAUTH_CLIENT_SECRET
		) {
			console.debug('Application is not authorized')
			console.debug('client_id', process.env.OAUTH_CLIENT_ID)
			console.debug('client_secret', process.env.OAUTH_CLIENT_SECRET)
			return res.status(401).send('Application is not authorized')
		}

		if (!code) {
			console.debug('Code is required')
			return res.status(400).send('Code is required')
		}

		try {
			const { login, scope } = jwt.verify(
				code,
				process.env.JWT_SECRET as string
			) as EncodedToken

			const trainer = await prisma.trainer.findUnique({ where: { login } })
			if (!trainer) {
				return res.status(404).send('Trainer not found')
			}

			const accessToken = jwt.sign(
				{
					id: trainer.id,
					scope,
					// scopes: 'read:trainer',
				},
				process.env.JWT_SECRET as string,
				{
					expiresIn: '30m',
				}
			)

			res.status(200).send({
				access_token: accessToken,
				// refresh_token: accessToken,
				tokenTypes: 'Bearer',
				expiresIn: '30m',
			})
		} catch (e) {
			console.error(e)
			res.status(500).send(e)
		}
	}
}
