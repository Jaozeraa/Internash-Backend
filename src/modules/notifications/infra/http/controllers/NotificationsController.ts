import { Request, Response } from 'express'
import { container } from 'tsyringe'

import CreateNotificationService from '@modules/notifications/services/CreateNotificationService'
import UpdateNotificationStatusService from '@modules/notifications/services/UpdateNotificationStatusService'
import ListUserNotificationsService from '@modules/notifications/services/ListUserNotificationsService'

export default class NotificationsController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { image_url, title, description, recipient_id } = request.body
		const createNotification = container.resolve(CreateNotificationService)

		const notification = await createNotification.execute({
			description,
			image_url,
			title,
			recipient_id
		})

		const targetSocket = request.connectedUsers[notification.recipient_id];

		request.io.to(targetSocket).emit('notification', notification)


		return response.json(notification)
	}

	public async index(request: Request, response: Response): Promise<Response> {
		const { id } = request.user
		const listUserNotifications = container.resolve(ListUserNotificationsService)

		const candyCover = await listUserNotifications.execute({
				user_id: id
		})


		return response.json(candyCover)
	}

	public async update(request: Request, response: Response): Promise<Response> {
		const { id } = request.user

		const updateNotificationStatus = container.resolve(UpdateNotificationStatusService)

		await updateNotificationStatus.execute({
				user_id: id
		})

		return response.status(204).send()
	}
}