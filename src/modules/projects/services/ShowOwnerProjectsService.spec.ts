import CreateProjectService from './CreateProjectService';
import ShowOwnerProjectsService from './ShowOwnerProjectsService';
import FakeProjectsRepository from '../repositories/fakes/FakeProjectsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import AppError from '@shared/errors/AppError';

let createProject: CreateProjectService;
let fakeStorageProvider: FakeStorageProvider;
let showOwnerProjects: ShowOwnerProjectsService;
let fakeProjectsRepository: FakeProjectsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('ShowOwnerProjects', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    createProject = new CreateProjectService(
      fakeProjectsRepository,
      fakeUsersRepository,
      fakeStorageProvider
    );
    showOwnerProjects = new ShowOwnerProjectsService(
      fakeProjectsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to list own projects', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    const project1 = await createProject.execute({
      title: 'title test1',
      description: 'description test1',
      image: 'project1.jpg',
      owner_id: user.id,
    });

    const project2 = await createProject.execute({
      title: 'title test2',
      description: 'description test2',
      image: 'project2.jpg',
      owner_id: user.id,
    });

    const ownProjects = await showOwnerProjects.execute({
      owner_id: user.id,
    })

    expect(ownProjects).toEqual([project1, project2])
  })
  it('should not be able to list own projects using a invalid user', async () => {
    await expect(
      showOwnerProjects.execute({
        owner_id: 'invalid-user-id'
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
})