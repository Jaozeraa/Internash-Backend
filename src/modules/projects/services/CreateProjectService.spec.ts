import CreateProjectService from './CreateProjectService';
import FakeProjectsRepository from '../repositories/fakes/FakeProjectsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import AppError from '@shared/errors/AppError';

let createProject: CreateProjectService;
let fakeProjectsRepository: FakeProjectsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;

describe('CreateProject', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    createProject = new CreateProjectService(
      fakeProjectsRepository,
      fakeUsersRepository,
      fakeStorageProvider
    );
  });

  it('should be able to create a project', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    const project = await createProject.execute({
      title: 'title test',
      description: 'description test',
      image: 'project.jpg',
      owner_id: user.id,
    });

    expect(project).toHaveProperty('id');
  })
  it('should not be able to create a project using a invalid user', async () => {
    await expect(
      createProject.execute({
        title: 'title test',
        description: 'description test',
        image: 'project.jpg',
        owner_id: 'invalid-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
})