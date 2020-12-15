import UpdateProjectEmployeeService from './UpdateProjectEmployeeService';
import FakeEmployeesRepository from '@modules/employees/repositories/fakes/FakeEmployeesRepository';
import FakeProjectsRepository from '@modules/projects/repositories/fakes/FakeProjectsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import AppError from '@shared/errors/AppError';

let updateProjectEmployee: UpdateProjectEmployeeService;
let fakeProjectsRepository: FakeProjectsRepository;
let fakeEmployeesRepository: FakeEmployeesRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('UpdateProjectEmployee', () => {
  beforeEach(() => {
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeEmployeesRepository = new FakeEmployeesRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    updateProjectEmployee = new UpdateProjectEmployeeService(
      fakeEmployeesRepository,
      fakeProjectsRepository,
    );
  });

  it('should be able to update project employee', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    const anotherUser1 = await fakeUsersRepository.create({
      email: 'test1@example.com',
      name: 'Test1',
      password: '123',
      skill: 'whatever'
    });

    const project = await fakeProjectsRepository.create({
      title: 'title test',
      description: 'description test',
      image: 'project.jpg',
      owner_id: user.id,
    });

    const employee = await fakeEmployeesRepository.create({
      payment: 2000,
      project_id: project.id,
      status: 'test',
      user_id: anotherUser1.id,
    })

    const updatedEmployee = await updateProjectEmployee.execute({
      employee_id: employee.id,
      owner_id: user.id,
      payment: 3000,
      status: 'newStatus'
    })

    expect(updatedEmployee.payment).toBe(3000)
    expect(updatedEmployee.status).toBe('newStatus')
  })
  it('should not be able to update project employee using a invalid employee id', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    const project = await fakeProjectsRepository.create({
      title: 'title test',
      description: 'description test',
      image: 'project.jpg',
      owner_id: user.id,
    });

    await expect(updateProjectEmployee.execute({
      employee_id: 'invalid_employee_id',
      owner_id: user.id,
      payment: 3000,
      status: 'newStatus'
    })).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to update project employee using a not project owner user', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    const anotherUser1 = await fakeUsersRepository.create({
      email: 'test1@example.com',
      name: 'Test1',
      password: '123',
      skill: 'whatever'
    });

    const anotherUser2 = await fakeUsersRepository.create({
      email: 'test2@example.com',
      name: 'Test2',
      password: '123',
      skill: 'whatever'
    });

    const project = await fakeProjectsRepository.create({
      title: 'title test',
      description: 'description test',
      image: 'project.jpg',
      owner_id: user.id,
    });

    const employee = await fakeEmployeesRepository.create({
      payment: 2000,
      project_id: project.id,
      status: 'test',
      user_id: anotherUser1.id,
    })

    await expect(updateProjectEmployee.execute({
      employee_id: employee.id,
      owner_id: anotherUser2.id,
      payment: 3000,
      status: 'newStatus'
    })).rejects.toBeInstanceOf(AppError)
  })
})