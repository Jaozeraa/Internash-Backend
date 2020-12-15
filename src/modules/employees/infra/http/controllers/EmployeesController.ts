import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import CreateProjectEmployeeService from '@modules/employees/services/CreateProjectEmployeeService'
import ShowProjectEmployeesService from '@modules/employees/services/ShowProjectEmployeesService'
import UpdateProjectEmployeeService from '@modules/employees/services/UpdateProjectEmployeeService'
import DeleteProjectEmployeeService from '@modules/employees/services/DeleteProjectEmployeeService'

export default class EmployeesController {
    public async create(request: Request, response: Response): Promise<Response> {
			const {payment, status, user_id} = request.body
			const {project_id} = request.params
			const { id } = request.user
      const createProjectEmployee = container.resolve(CreateProjectEmployeeService)

      const employee = await createProjectEmployee.execute({
				payment,
				project_id,
				status,
				user_id,
				owner_id: id
      })

      return response.json(classToClass(employee))
    }

    public async index(request: Request, response: Response): Promise<Response> {
      const {project_id} = request.params
      const showProjectEmployees = container.resolve(ShowProjectEmployeesService)

      const employees = await showProjectEmployees.execute({
				project_id
      })

      return response.json(classToClass(employees))
    }

    public async update(request: Request, response: Response): Promise<Response> {
      const {employee_id} = request.params
      const { status, payment } = request.body
      const { id } = request.user
      const updateProjectEmployee = container.resolve(UpdateProjectEmployeeService)

      const employee = await updateProjectEmployee.execute({
        employee_id,
        owner_id: id,
        payment,
        status
      })

      return response.json(classToClass(employee))
    }

    public async destroy(request: Request, response: Response): Promise<Response> {
      const {employee_id} = request.params
      const { id } = request.user
      const deleteProjectEmployee = container.resolve(DeleteProjectEmployeeService)

      await deleteProjectEmployee.execute({
        employee_id,
        owner_id: id
      })

      return response.status(204).send()
    }
}