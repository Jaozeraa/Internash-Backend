import "reflect-metadata"
import { injectable, inject } from 'tsyringe';

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string
}

@injectable()
export default class ShowInvolvedProjectsService {
  constructor(
    @inject('EmployeesRepository')
    private employeesRepository: IEmployeesRepository,
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest) {
      const userExists = await this.usersRepository.findById(user_id);

      if (!userExists) {
        throw new AppError('This user id is invalid');
      }
    
      const yourJobs = await this.employeesRepository.findAllByUserId(user_id);

      const involvedProjectsPromise = yourJobs.map(async (yourJob) => {
        const project = await this.projectsRepository.findById(yourJob.project_id)

        return {
          project
        }
      })

      const involvedProjects = await Promise.all(involvedProjectsPromise);

      return involvedProjects;
  }
}