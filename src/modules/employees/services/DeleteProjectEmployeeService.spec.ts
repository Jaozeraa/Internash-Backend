import DeleteProjectEmployeeService from './DeleteProjectEmployeeService';
import FakeEmployeesRepository from '@modules/employees/repositories/fakes/FakeEmployeesRepository';
import FakeProjectsRepository from '@modules/projects/repositories/fakes/FakeProjectsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import AppError from '@shared/errors/AppError';

let deleteProjectEmployee: DeleteProjectEmployeeService;
let fakeProjectsRepository: FakeProjectsRepository;
let fakeEmployeesRepository: FakeEmployeesRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('DeleteProjectEmployee', () => {
  beforeEach(() => {
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeEmployeesRepository = new FakeEmployeesRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    deleteProjectEmployee = new DeleteProjectEmployeeService(
      fakeEmployeesRepository,
      fakeProjectsRepository,
    );
  });

  it('should be able to delete a employee on a project', async () => {
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

    const employee1 = await fakeEmployeesRepository.create({
      payment: 2000,
      project_id: project.id,
      status: 'test',
      user_id: anotherUser1.id,
    })

    const employee2 = await fakeEmployeesRepository.create({
      payment: 2000,
      project_id: project.id,
      status: 'test',
      user_id: anotherUser2.id,
    })

    await deleteProjectEmployee.execute({
      employee_id: employee1.id,
      owner_id: user.id
    })

    const employees = await fakeEmployeesRepository.findAllByProjectId(project.id)

    expect(employees).toEqual([employee2])
  })
  it('should not be able to delete a employee using a invalid employee id', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    await expect(deleteProjectEmployee.execute({
      employee_id: 'invalid_employee_id',
      owner_id: user.id
    })).rejects.toBeInstanceOf(AppError)
  })
  it('should not be able to delete a employee using a not owner project user', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    const anotherUser = await fakeUsersRepository.create({
      email: 'test@example.com',
      name: 'Test',
      password: 'johndoe',
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
      user_id: anotherUser.id,
    });

    await expect(deleteProjectEmployee.execute({
      employee_id: employee.id,
      owner_id: anotherUser.id
    })).rejects.toBeInstanceOf(AppError)
  })
})