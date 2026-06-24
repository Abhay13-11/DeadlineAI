import OpenAI from 'openai'
import { env } from '../../config/env'
import { logger } from '../../utils/logger'
import * as fs from 'fs'
import * as path from 'path'

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })

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
    const dataUrl = `data:${mimeType};base64,${base64}`

    const completion = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: dataUrl, detail: 'high' },
            },
            {
              type: 'text',
              text: OCR_VISION_PROMPT,
            },
          ],
        },
      ],
      max_tokens: 1500,
    })

    const result = completion.choices[0]?.message?.content?.trim() ?? ''
    logger.info(`OCR extraction complete: ${result.length} chars`)
    return result
  }

  async extractFromImageUrl(imageUrl: string): Promise<string> {
    const completion = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: imageUrl, detail: 'high' },
            },
            {
              type: 'text',
              text: OCR_VISION_PROMPT,
            },
          ],
        },
      ],
      max_tokens: 1500,
    })

    return completion.choices[0]?.message?.content?.trim() ?? ''
  }

//   async extractFromPDFBuffer(buffer: Buffer): Promise<string> {
//     // For PDFs, we encode as base64 and send as document
//     // GPT-4o supports PDF documents directly
//     const base64 = buffer.toString('base64')

//     const completion = await openai.chat.completions.create({
//       model: env.OPENAI_MODEL,
//       messages: [
//         {
//           role: 'user',
//           content: [
//             {
//               type: 'text',
//               text: `Please extract all text from this PDF document and identify any tasks, deadlines, dates, required documents, or action items.\n\nFormat:\nEXTRACTED TEXT:\n[all text]\n\nKEY INFORMATION:\n[deadlines and tasks found]`,
//             },
//             // @ts-expect-error -- GPT-4o supports file input; type not yet in SDK types
//             {
//               type: 'file',
//               file: {
//                 data: base64,
//                 mime_type: 'application/pdf',
//               },
//             },
//           ],
//         },
//       ],
//       max_tokens: 2000,
//     })

//     const result = completion.choices[0]?.message?.content?.trim() ?? ''
//     logger.info(`PDF OCR extraction complete: ${result.length} chars`)
//     return result
//   }

  async extractFromPDFBuffer(buffer: Buffer): Promise<string> {
  logger.warn('PDF OCR is temporarily disabled.')
  return 'PDF OCR is not implemented yet.'
}
}

export const ocrService = new OCRService()