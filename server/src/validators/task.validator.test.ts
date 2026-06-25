import { createTaskSchema } from './task.validator'

describe('createTaskSchema', () => {
  it('normalizes blank optional form fields to undefined', () => {
    const result = createTaskSchema.parse({
      title: 'Minimal task',
      description: '',
      deadline: '',
      deadlineTime: '',
      location: '',
      meetingLink: '',
      websiteLink: '',
      notes: '',
    })

    expect(result).toMatchObject({
      title: 'Minimal task',
      category: 'Others',
      priority: 'Medium',
      status: 'Pending',
      requiredDocuments: [],
      reminders: [],
      recurring: { enabled: false, interval: 1 },
      source: 'manual',
    })
    expect(result.description).toBeUndefined()
    expect(result.deadline).toBeUndefined()
    expect(result.deadlineTime).toBeUndefined()
    expect(result.location).toBeUndefined()
    expect(result.meetingLink).toBeUndefined()
    expect(result.websiteLink).toBeUndefined()
    expect(result.notes).toBeUndefined()
  })

  it('accepts complete task data without changing meaningful values', () => {
    const result = createTaskSchema.parse({
      title: 'Interview',
      description: 'Technical round',
      category: 'Interview',
      priority: 'High',
      status: 'InProgress',
      deadline: '2026-06-30T12:00:00.000Z',
      deadlineTime: '17:30',
      location: 'Online',
      meetingLink: 'https://meet.example.com/interview',
      websiteLink: 'https://example.com',
      notes: 'Prepare system design',
      requiredDocuments: ['Resume'],
      reminders: [
        { type: '1d' },
        { type: 'custom', customTime: '2026-06-30T10:00:00.000Z' },
      ],
      recurring: {
        enabled: true,
        frequency: 'weekly',
        interval: 1,
        until: '2026-08-01T00:00:00.000Z',
      },
      source: 'manual',
    })

    expect(result.deadlineTime).toBe('17:30')
    expect(result.reminders).toHaveLength(2)
    expect(result.recurring.frequency).toBe('weekly')
  })

  it('still rejects malformed non-empty optional values', () => {
    expect(() =>
      createTaskSchema.parse({
        title: 'Bad task',
        deadlineTime: '25:99',
        meetingLink: 'not-a-url',
      })
    ).toThrow()
  })
})
