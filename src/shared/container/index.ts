import { container } from 'tsyringe'

import '@modules/users/providers'
import './providers'

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository'

import IProjectsRepository from '@modules/projects/repositories/IProjectsRepository';
import ProjectsRepository from '@modules/projects/infra/typeorm/repositories/ProjectsRepository'

import IEmployeesRepository from '@modules/employees/repositories/IEmployeesRepository';
import EmployeesRepository from '@modules/employees/infra/typeorm/repositories/EmployeesRepository'

import IConnectionsRepository from '@modules/connections/repositories/IConnectionsRepository';
import ConnectionsRepository from '@modules/connections/infra/typeorm/repositories/ConnectionsRepository'

container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository)

container.registerSingleton<INotificationsRepository>('NotificationsRepository', NotificationsRepository);

container.registerSingleton<IProjectsRepository>('ProjectsRepository', ProjectsRepository);

container.registerSingleton<IEmployeesRepository>('EmployeesRepository', EmployeesRepository);

container.registerSingleton<IConnectionsRepository>('ConnectionsRepository', ConnectionsRepository);