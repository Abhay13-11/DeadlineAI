import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { asyncHandler } from '../utils/asyncHandler'
import {
  getTasks, getDashboard, createTask,
  getTaskById, updateTask, deleteTask, updateTaskStatus,
} from '../controllers/task.controller'
import {
  createTaskSchema, updateTaskSchema,
  updateStatusSchema, taskQuerySchema,
} from '../validators/task.validator'

const router = Router()

router.use(authenticate)

router.get('/dashboard', asyncHandler(getDashboard))
router.get('/', validate(taskQuerySchema, 'query'), asyncHandler(getTasks))
router.post('/', validate(createTaskSchema), asyncHandler(createTask))
router.get('/:id', asyncHandler(getTaskById))
router.put('/:id', validate(updateTaskSchema), asyncHandler(updateTask))
router.delete('/:id', asyncHandler(deleteTask))
router.patch('/:id/status', validate(updateStatusSchema), asyncHandler(updateTaskStatus))

export { router as taskRoutes }