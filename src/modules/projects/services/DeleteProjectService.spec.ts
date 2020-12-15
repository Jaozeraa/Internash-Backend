import CreateProjectService from './CreateProjectService';
import DeleteProjectService from './DeleteProjectService';
import FakeProjectsRepository from '../repositories/fakes/FakeProjectsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'; 
import FakeStorageProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import AppError from '@shared/errors/AppError';

let createProject: CreateProjectService;
let deleteProject: DeleteProjectService;
let fakeProjectsRepository: FakeProjectsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;

describe('DeleteProject', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeUsersRepository = new  FakeUsersRepository();
    createProject = new CreateProjectService(
      fakeProjectsRepository,
      fakeUsersRepository,
      fakeStorageProvider
    );
    deleteProject = new DeleteProjectService(
      fakeProjectsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to delete a project', async () => {
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

    await deleteProject.execute({
      user_id: user.id,
      project_id: project2.id,
    })

    const projects = await fakeProjectsRepository.findAllByOwnerId(user.id)

    expect(projects).toEqual([project1])
  })
  it('should not be able to delete a project using a invalid user', async () => {
    await expect(
      deleteProject.execute({
        user_id: 'invalid_user_id',
        project_id: 'invalid_project_id'
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
  it('should not be able to delete a project using a invalid project', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      name: 'John doe',
      password: 'johndoe',
      skill: 'whatever'
    });

    await expect(
      deleteProject.execute({
        user_id: user.id,
        project_id: 'invalid_project_id'
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
  it('should not be able to delete a project using a not owner user', async () => {
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
      deleteProject.execute({
        user_id: anotherUser.id,
        project_id: project.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  })
})