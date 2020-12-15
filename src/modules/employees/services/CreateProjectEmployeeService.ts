import "reflect-metadata"
import { injectable, inject } from 'tsyringe';

import ICreateEmployeeDTO from '@modules/employees/dtos/ICreateEmployeeDTO';
import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest extends ICreateEmployeeDTO {
  owner_id: string
}

@injectable()
export default class CreateProjectEmployeeService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ payment, project_id, status, user_id, owner_id }: IRequest) {
      const userExists = await this.usersRepository.findById(user_id);

      if (!userExists) {
        throw new AppError('This user id is invalid');
      }

      const project = await this.projectsRepository.findById(project_id);

      if (!project) {
        throw new AppError('This project id is invalid');
      }

      if (project.owner_id !== owner_id) {
        throw new AppError('You need to be the project owner to add someone', 403);
      }

      if (project.owner_id === user_id) {
        throw new AppError('You can’t add yourself on your project');
      }
    
      const employee = await this.employeesRepository.create({
        payment, 
        project_id, 
        status, 
        user_id
      });

      return employee;
  }
}