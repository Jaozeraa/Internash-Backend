import CreateProjectService from './CreateProjectService';
import ShowInvolvedProjectsService from './ShowInvolvedProjectsService';
import FakeProjectsRepository from '../repositories/fakes/FakeProjectsRepository';
import FakeEmployeesRepository from '@modules/employees/repositories/fakes/FakeEmployeesRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import AppError from '@shared/errors/AppError';

let createProject: CreateProjectService;
let showInvolvedProjects: ShowInvolvedProjectsService;
let fakeProjectsRepository: FakeProjectsRepository;
let fakeEmployeesRepository: FakeEmployeesRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;

describe('ShowInvolvedProjects', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeEmployeesRepository = new FakeEmployeesRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    createProject = new CreateProjectService(
      fakeProjectsRepository,
      fakeUsersRepository,
      fakeStorageProvider
    );
    showInvolvedProjects = new ShowInvolvedProjectsService(
      fakeEmployeesRepository,
      fakeProjectsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to list involved projects', async () => {
    const user1 = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    const user2 = await fakeUsersRepository.create({
      email: 'test@example.com',
      name: 'Test',
      password: '123',
      skill: 'whatever'
    });

    const project1 = await createProject.execute({
      title: 'title test1',
      description: 'description test1',
      image: 'project1.jpg',
      owner_id: user1.id,
    });

    const project2 = await createProject.execute({
      title: 'title test2',
      description: 'description test2',
      image: 'project2.jpg',
      owner_id: user1.id,
    });

    await fakeEmployeesRepository.create({
      payment: 2000,
      project_id: project1.id,
      status: 'test',
      user_id: user2.id
    })

    await fakeEmployeesRepository.create({
      payment: 2000,
      project_id: project2.id,
      status: 'test',
      user_id: user2.id
    })

    const involvedProjects = await showInvolvedProjects.execute({
      user_id: user2.id
    })

    expect(involvedProjects).toEqual([{project: project1}, {project: project2}])
  })
  it('should not be able to list involved projects using a invalid user', async () => {
    await expect(
      showInvolvedProjects.execute({
        user_id: 'invalid-user-id'
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
})