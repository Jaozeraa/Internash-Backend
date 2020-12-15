import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import CreateConnectionService from '@modules/connections/services/CreateConnectionService'
import ShowConnectedUsersService from '@modules/connections/services/ShowConnectedUsersService'
import DeleteConnectionService from '@modules/connections/services/DeleteConnectionService'

export default class ConnectionsController {
    public async create(request: Request, response: Response): Promise<Response> {
			const { connected_user_email } = request.params
			const { id } = request.user
      const createConnection = container.resolve(CreateConnectionService)

      const connection = await createConnection.execute({
        user_id: id,
        connected_user_email
      })

      return response.json(classToClass(connection))
    }

    public async index(request: Request, response: Response): Promise<Response> {
      const { id } = request.user
      const showConnectedUsers = container.resolve(ShowConnectedUsersService)

      const connections = await showConnectedUsers.execute({
				user_id: id
      })

      return response.json(classToClass(connections))
    }

    public async destroy(request: Request, response: Response): Promise<Response> {
      const { id } = request.params
      const deleteConnection = container.resolve(DeleteConnectionService)

      await deleteConnection.execute({
        id
      })

      return response.status(204).send()
    }
}