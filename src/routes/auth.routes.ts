import express from 'express'
import AuthController from '../controllers/auth.controller'

const router = express.Router()

/*
 * POST /auth/register
 * Register a new trainer
 * @body {CreateTrainerDto} trainer
 * @return {Trainer} trainer
 */
router.post('/register', AuthController.register)

router.get('/authorize', AuthController.getAuthorize)
router.post('/authorize', AuthController.postAuthorize)
router.post('/token', AuthController.token)

export default router
