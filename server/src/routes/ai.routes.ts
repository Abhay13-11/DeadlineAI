import { Router } from 'express'
import multer from 'multer'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { asyncHandler } from '../utils/asyncHandler'
import { aiLimiter } from '../middleware/rateLimiter.middleware'
import {
  chat, getConversation, clearConversation,
  createFromText, confirmFromText,
  createFromImage, createFromPDF,
  suggestPlan,
} from '../controllers/ai.controller'
import { chatMessageSchema, naturalLanguageTaskSchema } from '../validators/ai.validator'

const router = Router()

// Memory storage — we pass buffer directly to OpenAI, no disk writes needed
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG, WebP, GIF images and PDF files are allowed'))
    }
  },
})

router.use(authenticate)
router.use(aiLimiter)

router.post('/chat',              validate(chatMessageSchema),             asyncHandler(chat))
router.get('/conversation',                                                asyncHandler(getConversation))
router.delete('/conversation',                                             asyncHandler(clearConversation))
router.post('/create-from-text',  validate(naturalLanguageTaskSchema),     asyncHandler(createFromText))
router.post('/create-from-text/confirm',                                   asyncHandler(confirmFromText))
router.post('/create-from-image', upload.single('file'),                   asyncHandler(createFromImage))
router.post('/create-from-pdf',   upload.single('file'),                   asyncHandler(createFromPDF))
router.post('/suggest-plan',                                               asyncHandler(suggestPlan))

export { router as aiRoutes }