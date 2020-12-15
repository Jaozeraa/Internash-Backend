import { getRepository, Repository } from 'typeorm';

import ICreateProjectDTO from '@modules/projects/dtos/ICreateProjectDTO';
import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import Project from '@modules/projects/infra/typeorm/entities/Project';

class ProjectsRepository implements IProjectsRepository {
  private ormRepository: Repository<Project>
  constructor() {
    this.ormRepository = getRepository(Project)
  }
  public async create({title, description, owner_id, image}: ICreateProjectDTO): Promise<Project> {
    const project = this.ormRepository.create({
      title, 
      description, 
      owner_id,
      image
    });

    await this.ormRepository.save(project);

    return project;
  }

  public async findAllByOwnerId(id: string): Promise<Project[]> {
    const projects = await this.ormRepository.find({ where: { owner_id: id } });

    return projects
  }

  public async findById(id: string): Promise<Project | undefined> {
    const project = await this.ormRepository.findOne(id);
    
    return project
  }

  public async deleteByProject(project: Project): Promise<void> {
    await this.ormRepository.remove(project)
    return
}

  public async save(project: Project): Promise<Project> {
      return this.ormRepository.save(project)
  }
}

export default ProjectsRepository;
