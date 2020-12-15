import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import CreateProjectService from '@modules/projects/services/CreateProjectService'
import UpdateProjectService from '@modules/projects/services/UpdateProjectService'
import DeleteProjectService from '@modules/projects/services/DeleteProjectService'
import ShowOwnerProjectsService from '@modules/projects/services/ShowOwnerProjectsService'
import ShowInvolvedProjectsService from '@modules/projects/services/ShowInvolvedProjectsService'

export default class ProjectController {
    public async create(request: Request, response: Response): Promise<Response> {
      const {title, description} = request.body
      const { id } = request.user
      const createProject = container.resolve(CreateProjectService)

      const project = await createProject.execute({
          description,
          image: request.file.filename,
          owner_id: id,
          title
      })

      return response.json(classToClass(project))
    }

    public async index(request: Request, response: Response): Promise<Response> {
      const { id } = request.user
      const showOwnerProjects = container.resolve(ShowOwnerProjectsService)

      const projects = await showOwnerProjects.execute({
          owner_id: id
      })

      return response.json(classToClass(projects))
    }

    public async show(request: Request, response: Response): Promise<Response> {
      const { id } = request.user
      const showInvolvedProjects = container.resolve(ShowInvolvedProjectsService)

      const projects = await showInvolvedProjects.execute({
          user_id: id
      })

      return response.json(classToClass(projects))
    }

    public async update(request: Request, response: Response): Promise<Response> {
      const {title, description} = request.body
      const { id } = request.user
      const {project_id} = request.params

      const updateProject = container.resolve(UpdateProjectService)

      const project = await updateProject.execute({
        description,
        project_id,
        title,
        user_id: id
      })

      return response.json(classToClass(project))
    }

    public async destroy(request: Request, response: Response): Promise<Response> {
      const { id } = request.user
      const {project_id} = request.params

      const deleteProject = container.resolve(DeleteProjectService)

      await deleteProject.execute({
        project_id,
        user_id: id
      })

      return response.status(204).send()
    }
}