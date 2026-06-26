import { AppError } from '../../utils/AppError'
import { assertGeminiConfigured, isGeminiConfigured } from './geminiClient.service'

describe('Gemini configuration', () => {
  it('rejects placeholder and malformed keys', () => {
    expect(isGeminiConfigured('your_gemini_key_here')).toBe(false)
    expect(isGeminiConfigured('replace_with_key')).toBe(false)
    expect(isGeminiConfigured('')).toBe(false)
  })

  it('accepts a structurally valid non-placeholder secret', () => {
    expect(isGeminiConfigured(`AIzaSy${'a'.repeat(34)}`)).toBe(true)
  })

  it('returns a service-unavailable error when the API key is missing', () => {
    expect(() => assertGeminiConfigured('')).toThrow(
      expect.objectContaining<Partial<AppError>>({
        statusCode: 503,
        message: 'AI provider is not configured. Set a valid GEMINI_API_KEY on the server.',
      })
    )
  })
})