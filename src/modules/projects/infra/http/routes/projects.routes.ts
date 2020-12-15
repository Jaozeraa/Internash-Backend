import { Router } from 'express'

import ProjectController from '../controllers/ProjectController'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'
import uploadConfig from '@config/upload'
import multer from 'multer'

const projectsRouter = Router()
const projectController = new ProjectController()
const upload = multer(uploadConfig.multer)

projectsRouter.use(ensureAuthenticated)

projectsRouter.post('/', upload.single('image'), projectController.create)

projectsRouter.get('/', projectController.index)

projectsRouter.get('/employee', projectController.show)

projectsRouter.put('/:project_id', projectController.update)

projectsRouter.delete('/:project_id', projectController.destroy)

export default projectsRouter
