import { Router } from 'express'

import EmployeesController from '../controllers/EmployeesController'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const employeesRouter = Router()
const employeesController = new EmployeesController()

employeesRouter.post('/:project_id', ensureAuthenticated, employeesController.create)

employeesRouter.get('/:project_id', employeesController.index)

employeesRouter.put('/:employee_id', ensureAuthenticated, employeesController.update)

employeesRouter.delete('/:employee_id', ensureAuthenticated, employeesController.destroy)

export default employeesRouter
