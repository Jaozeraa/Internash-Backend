import "reflect-metadata"
import { injectable, inject } from 'tsyringe';

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  project_id: string
}

@injectable()
export default class ShowProjectEmployeesService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ project_id }: IRequest) {
      const projectExists = await this.projectsRepository.findById(project_id);

      if (!projectExists) {
        throw new AppError('This project id is invalid');
      }
    
      const employees = await this.employeesRepository.findAllByProjectId(project_id);

      const formattedEmployeesPromise = employees.map(async (employee) => {
        const user = await this.usersRepository.findById(employee.user_id)

        return {
          ...employee,
          user
        }
      })

      const formattedEmployees = await Promise.all(formattedEmployeesPromise);

      return formattedEmployees;
  }
}