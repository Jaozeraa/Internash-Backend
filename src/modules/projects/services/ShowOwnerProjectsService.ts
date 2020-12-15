import "reflect-metadata"
import { injectable, inject } from 'tsyringe';

import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  owner_id: string
}

@injectable()
export default class ShowOwnerProjectsService {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ owner_id,}: IRequest) {
      const userExists = await this.usersRepository.findById(owner_id);

      if (!userExists) {
        throw new AppError('This owner id is invalid');
      }
    
      const projects = await this.projectsRepository.findAllByOwnerId(owner_id)

      return projects;
  }
}