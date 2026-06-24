import {
  startOfDay,
  endOfDay,
  addDays,
  addWeeks,
  addHours,
  addMinutes,
  isBefore,
  isAfter,
} from 'date-fns'
import { ReminderType, REMINDER_OFFSETS } from '../types'

export function getReminderFireTime(deadline: Date, type: ReminderType, customTime?: Date): Date | null {
  if (type === 'custom') {
    return customTime ?? null
  }
  const offsetMs = REMINDER_OFFSETS[type]
  return new Date(deadline.getTime() - offsetMs)
}

export function isDeadlinePassed(deadline: Date): boolean {
  return isBefore(deadline, new Date())
}

export function isTodayDeadline(deadline: Date): boolean {
  const now = new Date()
  return isAfter(deadline, startOfDay(now)) && isBefore(deadline, endOfDay(now))
}

export function getStartOfToday(): Date {
  return startOfDay(new Date())
}

export function getEndOfToday(): Date {
  return endOfDay(new Date())
}

export function getEndOfTomorrow(): Date {
  return endOfDay(addDays(new Date(), 1))
}

export function getStartOfTomorrow(): Date {
  return startOfDay(addDays(new Date(), 1))
}

export function getDaysFromNow(days: number): Date {
  return endOfDay(addDays(new Date(), days))
}

export { addDays, addWeeks, addHours, addMinutes, startOfDay, endOfDay }