import { Router } from 'express'

import ConnectionsController from '../controllers/ConnectionsController'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const connectionsRouter = Router()
const connectionsController = new ConnectionsController()

connectionsRouter.post('/:connected_user_email', ensureAuthenticated, connectionsController.create)

connectionsRouter.get('/', ensureAuthenticated, connectionsController.index)

connectionsRouter.delete('/:id', ensureAuthenticated, connectionsController.destroy)

export default connectionsRouter
