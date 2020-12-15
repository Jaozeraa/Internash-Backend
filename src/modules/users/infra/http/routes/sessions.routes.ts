import { Router } from 'express'

import SessionsController from '../controllers/SessionsController'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const sessionsRouter = Router()
const sessionsController = new SessionsController()


sessionsRouter.post('/', sessionsController.create)

export default sessionsRouter
