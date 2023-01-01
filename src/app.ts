import express, { Application, Express, Response } from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import dotenv from 'dotenv'

import swaggerDocument from '../.swagger/openapi.json'

import auth from './routes/auth.routes'
import log from './routes/log.routes'
import pokemon from './routes/pokemon.routes'
import trade from './routes/trade.routes'
import trainer from './routes/trainer.routes'
import { loggerMiddleware } from './middlewares/log.middleware'
import { isAuthenticated } from './middlewares/auth.middleware'
import { errorMiddleware } from './middlewares/error.middleware'

dotenv.config()

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(loggerMiddleware)
app.use('/auth', auth)
app.use('/trainers', isAuthenticated, trainer)
app.use('/pokemons', isAuthenticated, pokemon)
app.use('/trades', isAuthenticated, trade)
app.use('/logs', isAuthenticated, log)
app.get('*', (_, res: Response) => {
	res.status(404).send('404 - Not Found')
})
app.use(errorMiddleware)


export default app
