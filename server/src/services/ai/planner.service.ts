import { Types } from 'mongoose'
import { Task } from '../../models/Task.model'
import { startOfDay, endOfDay, addDays } from 'date-fns'
import { generateGeminiText } from './geminiClient.service'

export class PlannerService {
  async generateDailyPlan(userId: string): Promise<string> {
    const now = new Date()
    const uid = new Types.ObjectId(userId)

    const [todayTasks, upcomingTasks] = await Promise.all([
      Task.find({
        userId: uid,
        isArchived: false,
        deadline: { $gte: startOfDay(now), $lte: endOfDay(now) },
        status: { $nin: ['Completed', 'Missed'] },
      }).sort({ priority: -1 }).lean(),

      Task.find({
        userId: uid,
        isArchived: false,
        deadline: { $gt: endOfDay(now), $lte: endOfDay(addDays(now, 3)) },
        status: { $nin: ['Completed', 'Missed'] },
      }).sort({ deadline: 1, priority: -1 }).lean(),
    ])

    const todayList = todayTasks.map(
      (t) => `- ${t.title} [${t.priority}] [${t.category}]${t.deadlineTime ? ` at ${t.deadlineTime}` : ''}`
    ).join('\n') || 'No tasks due today'

    const upcomingList = upcomingTasks.map(
      (t) => `- ${t.title} [${t.priority}] due ${new Date(t.deadline!).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`
    ).join('\n') || 'No upcoming tasks in next 3 days'

    const prompt = `You are a productivity coach. Create a clear, motivating daily plan.

TODAY'S TASKS:
${todayList}

COMING SOON (next 3 days):
${upcomingList}

Generate a practical daily plan with:
1. Morning priorities (what to tackle first and why)
2. Afternoon focus
3. Quick wins to build momentum
4. One key thing not to forget today

Keep it concise, friendly, and actionable. Use bullet points.`

    const plan = await generateGeminiText({
      systemInstruction: 'You are a helpful productivity coach for students and professionals.',
      prompt,
      maxOutputTokens: 600,
      temperature: 0.7,
    })

    return plan || 'Could not generate plan.'
  }
}

export const plannerService = new PlannerService()
