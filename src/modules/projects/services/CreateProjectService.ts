import "reflect-metadata"
import { injectable, inject } from 'tsyringe';

import ICreateProjectDTO from '@modules/projects/dtos/ICreateProjectDTO';
import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";

interface IRequest extends ICreateProjectDTO {}

@injectable()
export default class CreateProjectService {
  constructor(
    @inject('ProjectsRepository')
    private projectsRepository: IProjectsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ owner_id, description, title, image }: IRequest) {
      const userExists = await this.usersRepository.findById(owner_id);

      if (!userExists) {
        throw new AppError('This owner id is invalid');
      }

      const filename = await this.storageProvider.saveFile(image)
    
      const project = await this.projectsRepository.create({
        description, 
        title,
        owner_id,
        image: filename
      });

      return project;
  }
}