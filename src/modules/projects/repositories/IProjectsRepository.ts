import Project from '../infra/typeorm/entities/Project';
import ICreateProjectDTO from '../dtos/ICreateProjectDTO'

export default interface INotificationsRepository {
  create(data: ICreateProjectDTO): Promise<Project>;
  findAllByOwnerId(id: string): Promise<Project[]>;
  findById(id: string): Promise<Project | undefined>;
  deleteByProject(project: Project): Promise<void>;
  save(project: Project): Promise<Project>;
}