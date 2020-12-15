import { getRepository, Repository } from 'typeorm';

import ICreateEmployeeDTO from '@modules/employees/dtos/ICreateEmployeeDTO';
import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import Employee from '@modules/employees/infra/typeorm/entities/Employee';

class EmployeesRepository implements IEmployeesRepository {
  private ormRepository: Repository<Employee>
  constructor() {
    this.ormRepository = getRepository(Employee)
  }
  public async create({payment, project_id, status, user_id}: ICreateEmployeeDTO): Promise<Employee> {
    const employee = this.ormRepository.create({
      payment, 
      project_id, 
      status, 
      user_id
    });

    await this.ormRepository.save(employee);

    return employee;
  }

  public async save(employee: Employee): Promise<Employee> {
      return this.ormRepository.save(employee)
  }

  public async findAllByProjectId(project_id: string): Promise<Employee[]> {
    const employees = await this.ormRepository.find({
      where: { project_id },
    });

    return employees;
  }

  public async findById(id: string): Promise<Employee | undefined> {
    const employee = await this.ormRepository.findOne(id);

    return employee;
  }

  public async findAllByUserId(user_id: string): Promise<Employee[]> {
    const employees = await this.ormRepository.find({
      where: { user_id }
    });

    return employees;
  }

  public async deleteByEmployee(employee: Employee): Promise<void> {
    await this.ormRepository.remove(employee)

    return
}
}

export default EmployeesRepository;
