import { makeId } from '@/lib/id'
import { COMPANY_ID } from '@/data/employees'
import type { HandbookAcknowledgement } from '@/types'

const now = Date.now()
function ago(hours: number): string {
  return new Date(now - hours * 3600000).toISOString()
}

function ack(employeeId: string, hoursAgo: number): HandbookAcknowledgement {
  return { id: makeId('hack'), companyId: COMPANY_ID, handbookVersion: 3, employeeId, acknowledgedAt: ago(hoursAgo) }
}

export const SEED_HANDBOOK_ACKNOWLEDGEMENTS: HandbookAcknowledgement[] = [
  ack('emp_sarah', 200),
  ack('emp_jordan', 190),
  ack('emp_carlos', 180),
  ack('emp_priya', 170),
]
