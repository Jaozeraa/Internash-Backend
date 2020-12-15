import ICreateEmployeeDTO from '../dtos/ICreateEmployeeDTO';
import Employee from '../infra/typeorm/entities/Employee';

export default interface IEmployeesRepository {
  create(data: ICreateEmployeeDTO): Promise<Employee>;
  findAllByProjectId(project_id: string): Promise<Employee[]>;
  findById(id: string): Promise<Employee | undefined>;
  findAllByUserId(user_id: string): Promise<Employee[]>;
  save(employee: Employee): Promise<Employee>;
  deleteByEmployee(employee: Employee): Promise<void>;
}