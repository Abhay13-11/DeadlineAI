import { Request, Response } from 'express'
import { IUser } from '../models/User.model'
import { analyticsService } from '../services/analytics.service'
import { sendSuccess } from '../utils/apiResponse'

export async function getOverview(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const data = await analyticsService.getOverview(user._id.toString())
  sendSuccess(res, data, 'Overview retrieved')
}

export async function getWeeklyReport(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const data = await analyticsService.getWeeklyReport(user._id.toString())
  sendSuccess(res, data, 'Weekly report retrieved')
}

export async function getMonthlyReport(req: Request, res: Response): Promise<void> {
  const user = req.user as IUser
  const data = await analyticsService.getMonthlyReport(user._id.toString())
  sendSuccess(res, data, 'Monthly report retrieved')
}