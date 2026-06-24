import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'
import { getOverview, getWeeklyReport, getMonthlyReport } from '../controllers/analytics.controller'

const router = Router()

router.use(authenticate)

router.get('/overview', asyncHandler(getOverview))
router.get('/weekly', asyncHandler(getWeeklyReport))
router.get('/monthly', asyncHandler(getMonthlyReport))

export { router as analyticsRoutes }