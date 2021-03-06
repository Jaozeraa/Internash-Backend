import "reflect-metadata"
import { injectable, inject } from 'tsyringe';

import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  project_id: string;
  title: string;
  description: string;
}

@injectable()
export default class UpdateProjectService {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, project_id, title, description }: IRequest) {
      const userExists = await this.usersRepository.findById(user_id);

      if (!userExists) {
        throw new AppError('This user id is invalid');
      }
    
      const project = await this.projectsRepository.findById(project_id)

      if (!project) {
        throw new AppError('This project id is invalid');
      }

      if(project.owner_id !== user_id) {
        throw new AppError('You need to be the project owner to do this action', 403);
      }

      project.title = title;
      project.description = description;

      await this.projectsRepository.save(project);

      return project;
  }
}