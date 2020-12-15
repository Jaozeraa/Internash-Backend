import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes'
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes'
import profileRouter from '@modules/users/infra/http/routes/profile.routes'
import projectsRouter from '@modules/projects/infra/http/routes/projects.routes'
import employeesRouter from '@modules/employees/infra/http/routes/employees.routes'
import connectionsRouter from '@modules/connections/infra/http/routes/connections.routes'
import notificationsRouter from '@modules/notifications/infra/http/routes/notifications.routes'

const routes = Router();

routes.use('/users', usersRouter)

routes.use('/notifications', notificationsRouter)

routes.use('/profile', profileRouter)

routes.use('/projects', projectsRouter)

routes.use('/employees', employeesRouter)

routes.use('/sessions', sessionsRouter)

routes.use('/connections', connectionsRouter)

export default routes;
