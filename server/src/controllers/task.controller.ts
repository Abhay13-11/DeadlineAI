import { Request, Response } from 'express'
import { IUser } from '../models/User.model'
import { taskService } from '../services/task.service'
import { sendSuccess } from '../utils/apiResponse'
import {
  CreateTaskInput, UpdateTaskInput,
  UpdateStatusInput, TaskQueryInput,
} from '../validators/task.validator'

export async function getTasks(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const query = req.query as unknown as TaskQueryInput
  const result = await taskService.getTasks(user._id.toString(), query)
  sendSuccess(res, result.items, 'Tasks retrieved', 200, {
    page: result.page,
    limit: 0,
    total: result.total,
    totalPages: result.totalPages,
  })
}

export async function getDashboard(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const data = await taskService.getDashboard(user._id.toString())
  sendSuccess(res, data, 'Dashboard loaded')
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const task = await taskService.create(user._id.toString(), req.body as CreateTaskInput)
  sendSuccess(res, task, 'Task created', 201)
}

export async function getTaskById(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const task = await taskService.getById(user._id.toString(), req.params.id)
  sendSuccess(res, task, 'Task retrieved')
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const task = await taskService.update(
    user._id.toString(),
    req.params.id,
    req.body as UpdateTaskInput
  )
  sendSuccess(res, task, 'Task updated')
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  await taskService.delete(user._id.toString(), req.params.id)
  sendSuccess(res, null, 'Task deleted')
}

export async function updateTaskStatus(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const { status } = req.body as UpdateStatusInput
  const task = await taskService.updateStatus(user._id.toString(), req.params.id, status as import('../types').TaskStatus)
  sendSuccess(res, task, 'Status updated')
}