import { logger } from '../../utils/logger'
import { generateGeminiText } from './geminiClient.service'

const OCR_VISION_PROMPT = `You are an OCR and information extraction assistant.

Extract ALL text from this image exactly as it appears.
Then identify and list any deadlines, dates, times, task names, event names, registration links, or required documents you can see.

Format your response as:
EXTRACTED TEXT:
[full text from image]

KEY INFORMATION:
[bullet points of deadlines, tasks, links, documents found]`

export class OCRService {
  async extractFromImageBuffer(buffer: Buffer, mimeType: string): Promise<string> {
    const base64 = buffer.toString('base64')

    const result = await generateGeminiText({
      parts: [
        {
          inlineData: {
            data: base64,
            mimeType,
          },
        },
        { text: OCR_VISION_PROMPT },
      ],
      maxOutputTokens: 1500,
    })

    logger.info(`OCR extraction complete: ${result.length} chars`)
    return result
  }

  async extractFromImageUrl(imageUrl: string): Promise<string> {
    return generateGeminiText({
      parts: [
        {
          fileData: {
            fileUri: imageUrl,
            mimeType: 'image/*',
          },
        },
        { text: OCR_VISION_PROMPT },
      ],
      maxOutputTokens: 1500,
    })
  }

  async extractFromPDFBuffer(buffer: Buffer): Promise<string> {
    const base64 = buffer.toString('base64')
    const result = await generateGeminiText({
      parts: [
        {
          inlineData: {
            data: base64,
            mimeType: 'application/pdf',
          },
        },
        {
          text: 'Please extract all text from this PDF document and identify any tasks, deadlines, dates, required documents, or action items.\n\nFormat:\nEXTRACTED TEXT:\n[all text]\n\nKEY INFORMATION:\n[deadlines and tasks found]',
        },
      ],
      maxOutputTokens: 2000,
    })

    logger.info(`PDF OCR extraction complete: ${result.length} chars`)
    return result
  }
}

export const ocrService = new OCRService()
