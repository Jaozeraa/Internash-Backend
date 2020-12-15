import ShowProjectEmployeesService from './ShowProjectEmployeesService';
import FakeEmployeesRepository from '@modules/employees/repositories/fakes/FakeEmployeesRepository';
import FakeProjectsRepository from '@modules/projects/repositories/fakes/FakeProjectsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import AppError from '@shared/errors/AppError';

let showProjectEmployees: ShowProjectEmployeesService;
let fakeProjectsRepository: FakeProjectsRepository;
let fakeEmployeesRepository: FakeEmployeesRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('ShowProjectEmployees', () => {
  beforeEach(() => {
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeEmployeesRepository = new FakeEmployeesRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    showProjectEmployees = new ShowProjectEmployeesService(
      fakeEmployeesRepository,
      fakeProjectsRepository,
      fakeUsersRepository
    );
  });

  it('should be able to show project employees', async () => {
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

    const employees = await showProjectEmployees.execute({
      project_id: project.id,
    })

    expect(employees[0].id).toBe(employee1.id)
    expect(employees[1].id).toBe(employee2.id)
  })
  it('should be not able to show project employees using a invalid project id', async () => {
    await expect(showProjectEmployees.execute({
      project_id: 'invalid_project_id',
    })).rejects.toBeInstanceOf(AppError)
  })
})