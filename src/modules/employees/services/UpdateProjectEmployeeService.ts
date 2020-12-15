import "reflect-metadata"
import { injectable, inject } from 'tsyringe';

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest{
  owner_id: string
  employee_id: string
  payment: number
  status: string
}

@injectable()
export default class UpdateProjectEmployeeService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
  ) {}

  public async execute({ employee_id, owner_id, payment, status  }: IRequest) {
    const employee = await this.employeesRepository.findById(employee_id)

    if (!employee) {
      throw new AppError('This employee id is invalid');
    }

    const project = await this.projectsRepository.findById(employee.project_id);

    if (project?.owner_id !== owner_id) {
      throw new AppError('You need to be the project owner to update someone', 403);
    }

    employee.payment = payment
    employee.status = status

    await this.employeesRepository.save(employee);

    return employee;
  }
}