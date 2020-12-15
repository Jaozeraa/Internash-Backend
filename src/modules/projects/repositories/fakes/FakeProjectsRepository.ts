import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import ICreateProjectDTO from '@modules/projects/dtos/ICreateProjectDTO';
import Project from '@modules/projects/infra/typeorm/entities/Project';
import { uuid } from 'uuidv4';

export default class FakeProjectsRepository implements IProjectsRepository {
  private projects: Project[] = [];
  public async create({ description, image, owner_id, title }: ICreateProjectDTO) {
    const project = new Project();

    Object.assign(project, {
      id: uuid(),
      title,
      description,
      image,
      owner_id,
      updated_at: new Date(),
      created_at: new Date(),
  })

    this.projects.push(project);

    return project;
  }
  
  public async save(project: Project): Promise<Project> {
      const chosenProjectIndex = this.projects.findIndex(findProject => findProject.id === project.id);

      this.projects[chosenProjectIndex] = project;

      return project;
  }

  public async findById(id: string): Promise<Project | undefined> {
    const project = this.projects.find(findProject => findProject.id === id);
    
    return project;
  }

  public async findAllByOwnerId(owner_id: string): Promise<Project[]> {
    const projects = this.projects.filter(findProject => findProject.owner_id === owner_id);
    
    return projects;
  }

  public async deleteByProject(project: Project): Promise<void> {
    const projectIndex = this.projects.findIndex(filteredProject => filteredProject === project)

      delete this.projects[projectIndex]

      return
  }
}