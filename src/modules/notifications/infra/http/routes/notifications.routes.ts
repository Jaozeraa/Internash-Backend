import { Router } from 'express'

import NotificationsController from '../controllers/NotificationsController'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const notificationsRouter = Router()
const notificationsController = new NotificationsController()

notificationsRouter.post('/', notificationsController.create)

notificationsRouter.get('/', ensureAuthenticated, notificationsController.index)

notificationsRouter.patch('/', ensureAuthenticated, notificationsController.update)

export default notificationsRouter