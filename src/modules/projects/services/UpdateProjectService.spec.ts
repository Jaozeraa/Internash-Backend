import CreateProjectService from './CreateProjectService';
import UpdateProjectService from './UpdateProjectService';
import FakeProjectsRepository from '../repositories/fakes/FakeProjectsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import AppError from '@shared/errors/AppError';

let fakeStorageProvider: FakeStorageProvider;
let createProject: CreateProjectService;
let updateProject: UpdateProjectService;
let fakeProjectsRepository: FakeProjectsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('UpdateProject', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    createProject = new CreateProjectService(
      fakeProjectsRepository,
      fakeUsersRepository,
      fakeStorageProvider
    );
    updateProject = new UpdateProjectService(
      fakeProjectsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to update a project', async () => {
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

    const updatedProject = await updateProject.execute({
      user_id: user.id,
      project_id: project.id,
      title: 'test',
      description: 'test',
    })

    expect(updatedProject.title).toBe('test')
    expect(updatedProject.description).toBe('test')
  })
  it('should not be able to update a project using a invalid user', async () => {
    await expect(
      updateProject.execute({
        user_id: 'invalid_user_id',
        project_id: 'invalid_project_id',
        title: 'test',
        description: 'test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
  it('should not be able to update a project using a invalid project', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    await expect(
      updateProject.execute({
        user_id: user.id,
        project_id: 'invalid_project_id',
        title: 'test',
        description: 'test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
  it('should not be able to update a project using a not owner user', async () => {
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

    const project = await createProject.execute({
      title: 'title test',
      description: 'description test',
      image: 'project.jpg',
      owner_id: user.id,
    });

    await expect(
      updateProject.execute({
        user_id: anotherUser.id,
        project_id: project.id,
        title: 'test',
        description: 'test',
      })
    ).rejects.toBeInstanceOf(AppError);
  })
})