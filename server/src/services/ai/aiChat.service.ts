import { Types } from 'mongoose'
import { AIConversation } from '../../models/AIConversation.model'
import { Task } from '../../models/Task.model'
import { logger } from '../../utils/logger'
import { GeminiMessage, generateGeminiResponse } from './geminiClient.service'

const SYSTEM_PROMPT = `You are DeadlineAI, a highly intelligent personal productivity assistant for college students and professionals.

You have access to the user's complete task list (provided below). Your job is to:
1. Answer questions about their tasks clearly and helpfully
2. Suggest priorities and what to focus on
3. Identify overdue or urgent items
4. Help them plan their day or week
5. Extract and create tasks from natural descriptions when asked

Always respond in a friendly, concise, and actionable manner.
Format responses using short paragraphs or bullet points when listing tasks.
When listing tasks, include the title, deadline, and priority.
If the user asks you to create a task, confirm what you understood and tell them the task has been queued — do not say you cannot take action.

Current date and time: {{CURRENT_DATETIME}}

USER'S TASKS:
{{TASKS}}`

export class AIChatService {
  async chat(userId: string, userMessage: string): Promise<string> {
    // Fetch user's tasks for context
    const tasks = await Task.find({
      userId: new Types.ObjectId(userId),
      isArchived: false,
    })
      .select('title category priority status deadline deadlineTime requiredDocuments notes')
      .sort({ deadline: 1 })
      .limit(100)
      .lean()

    const taskContext = tasks.length > 0
      ? tasks.map((t) => {
          const deadline = t.deadline
            ? new Date(t.deadline).toLocaleDateString('en-IN', {
                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
              })
            : 'No deadline'
          const docs = t.requiredDocuments?.length ? ` | Docs: ${t.requiredDocuments.join(', ')}` : ''
          return `- [${t.status}] ${t.title} | ${t.category} | ${t.priority} priority | Due: ${deadline}${docs}`
        }).join('\n')
      : 'No tasks found.'

    const systemPrompt = SYSTEM_PROMPT
      .replace('{{CURRENT_DATETIME}}', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }))
      .replace('{{TASKS}}', taskContext)

    // Load or create conversation
    let conversation = await AIConversation.findOne({ userId: new Types.ObjectId(userId) })
    if (!conversation) {
      conversation = await AIConversation.create({ userId: new Types.ObjectId(userId), messages: [] })
    }

    // Keep last 20 messages for context window efficiency
    const recentMessages = conversation.messages.slice(-20)

    const geminiMessages: GeminiMessage[] = [
      ...recentMessages.map((m) => ({
        role: m.role === 'assistant' ? 'model' as const : 'user' as const,
        text: m.content,
      })),
      { role: 'user', text: userMessage },
    ]

    const response = await generateGeminiResponse({
      systemInstruction: systemPrompt,
      messages: geminiMessages,
      maxOutputTokens: 800,
      temperature: 0.7,
    })

    const reply = response.text?.trim() ?? 'Sorry, I could not generate a response.'

    // Persist both messages
    conversation.messages.push(
      { _id: new Types.ObjectId(), role: 'user', content: userMessage, timestamp: new Date(), taskReferences: [] },
      { _id: new Types.ObjectId(), role: 'assistant', content: reply, timestamp: new Date(), taskReferences: [] }
    )

    // Cap at 200 messages
    if (conversation.messages.length > 200) {
      conversation.messages = conversation.messages.slice(-200)
    }

    await conversation.save()

    logger.info(`AI chat: user=${userId} tokens=${response.usageMetadata?.totalTokenCount}`)
    return reply
  }

  async getConversation(userId: string) {
    const conversation = await AIConversation.findOne({ userId: new Types.ObjectId(userId) })
    return conversation?.messages ?? []
  }

  async clearConversation(userId: string): Promise<void> {
    await AIConversation.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: { messages: [] } },
      { upsert: true }
    )
  }
}

export const aiChatService = new AIChatService()
