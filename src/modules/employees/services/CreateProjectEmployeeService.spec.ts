import CreateProjectEmployeeService from './CreateProjectEmployeeService';
import FakeEmployeesRepository from '@modules/employees/repositories/fakes/FakeEmployeesRepository';
import FakeProjectsRepository from '@modules/projects/repositories/fakes/FakeProjectsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import AppError from '@shared/errors/AppError';

let createProjectEmployee: CreateProjectEmployeeService;
let fakeProjectsRepository: FakeProjectsRepository;
let fakeEmployeesRepository: FakeEmployeesRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('CreateProjectEmployee', () => {
  beforeEach(() => {
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeEmployeesRepository = new FakeEmployeesRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    createProjectEmployee = new CreateProjectEmployeeService(
      fakeEmployeesRepository,
      fakeProjectsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to add a employee on a project', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    const anotherUser = await fakeUsersRepository.create({
      email: 'test@example.com',
      name: 'Test',
      password: '123',
      skill: 'whatever'
    });

    const project = await fakeProjectsRepository.create({
      title: 'title test',
      description: 'description test',
      image: 'project.jpg',
      owner_id: user.id,
    });

    const employee = await createProjectEmployee.execute({
      payment: 2000,
      project_id: project.id,
      status: 'test',
      user_id: anotherUser.id,
      owner_id: user.id,
    })

    expect(employee).toHaveProperty('id');
  })
  it('should not be able to add a employee on a project using a invalid project', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    const anotherUser = await fakeUsersRepository.create({
      email: 'test@example.com',
      name: 'Test',
      password: '123',
      skill: 'whatever'
    });

    await expect(
      createProjectEmployee.execute({
        payment: 2000,
        project_id: 'invalid_project_id',
        status: 'test',
        user_id: anotherUser.id,
        owner_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  })

  it('should not be able to add a employee on a project using a invalid user', async () => {
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

    await expect(
      createProjectEmployee.execute({
        payment: 2000,
        project_id: project.id,
        status: 'test',
        user_id: 'invalid_user_id',
        owner_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
  it('should not be able to add a employee on a project using a not owner user', async () => {
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

    await expect(
      createProjectEmployee.execute({
        payment: 2000,
        project_id: project.id,
        status: 'test',
        user_id: anotherUser2.id,
        owner_id: anotherUser1.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
  it('should not be able to add project owner as project employee', async () => {
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

    await expect(
      createProjectEmployee.execute({
        payment: 2000,
        project_id: project.id,
        status: 'test',
        user_id: user.id,
        owner_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
})