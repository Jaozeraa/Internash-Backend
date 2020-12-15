import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import ICreateEmployeeDTO from '@modules/employees/dtos/ICreateEmployeeDTO';
import Employee from '@modules/employees/infra/typeorm/entities/Employee';
import { uuid } from 'uuidv4';

export default class FakeEmployeesRepository implements IEmployeesRepository {
  private employees: Employee[] = [];
  public async create({ payment, project_id, status, user_id }: ICreateEmployeeDTO) {
    const employee = new Employee();

    Object.assign(employee, {
      id: uuid(),
      payment,
      project_id,
      status,
      user_id,
      updated_at: new Date(),
      created_at: new Date(),
  })

    this.employees.push(employee);

    return employee;
  }
  
  public async save(employee: Employee): Promise<Employee> {
      const chosenEmployeeIndex = this.employees.findIndex(findEmployee => findEmployee.id === employee.id);

      this.employees[chosenEmployeeIndex] = employee;

      return employee;
  }

  public async findById(id: string): Promise<Employee | undefined> {
    const employee = this.employees.find(findEmployee => findEmployee.id === id);
    
    return employee;
  }

  public async deleteByEmployee(employee: Employee): Promise<void> {
    const employeeIndex = this.employees.findIndex(filteredEmployee => filteredEmployee === employee)

      delete this.employees[employeeIndex]

      return
  }

  public async findAllByProjectId(project_id: string): Promise<Employee[]> {
    const employees = this.employees.filter(filteredEmployee => filteredEmployee.project_id === project_id);
    
    return employees;
  }

  public async findAllByUserId(user_id: string): Promise<Employee[]> {
    const employees = this.employees.filter(filteredEmployee => filteredEmployee.user_id === user_id);
    
    return employees;
  }
}