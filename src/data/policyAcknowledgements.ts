import { makeId } from '@/lib/id'
import { COMPANY_ID } from '@/data/employees'
import type { PolicyAcknowledgement } from '@/types'

const now = Date.now()
function ago(hours: number): string {
  return new Date(now - hours * 3600000).toISOString()
}

function ack(policyId: string, policyVersion: number, employeeId: string, hoursAgo: number): PolicyAcknowledgement {
  return { id: makeId('pack'), companyId: COMPANY_ID, policyId, policyVersion, employeeId, acknowledgedAt: ago(hoursAgo) }
}

export const SEED_POLICY_ACKNOWLEDGEMENTS: PolicyAcknowledgement[] = [
  // Store Opening Procedure v3 — 3 of 6 acknowledged
  ack('pol_opening', 3, 'emp_sarah', 40),
  ack('pol_opening', 3, 'emp_jordan', 30),
  ack('pol_opening', 3, 'emp_carlos', 20),

  // Store Closing Procedure v4 — 2 of 6 acknowledged (recently published)
  ack('pol_closing', 4, 'emp_carlos', 60),
  ack('pol_closing', 4, 'emp_emily', 50),

  // Emergency Evacuation Procedure v2 — fully acknowledged
  ack('pol_emergency', 2, 'emp_sarah', 400),
  ack('pol_emergency', 2, 'emp_mike', 390),
  ack('pol_emergency', 2, 'emp_jordan', 380),
  ack('pol_emergency', 2, 'emp_emily', 370),
  ack('pol_emergency', 2, 'emp_carlos', 360),
  ack('pol_emergency', 2, 'emp_priya', 350),

  // Customer Complaint Handling v1 — 5 of 6
  ack('pol_customer_complaints', 1, 'emp_sarah', 900),
  ack('pol_customer_complaints', 1, 'emp_jordan', 890),
  ack('pol_customer_complaints', 1, 'emp_emily', 880),
  ack('pol_customer_complaints', 1, 'emp_carlos', 870),
  ack('pol_customer_complaints', 1, 'emp_priya', 860),

  // Cash Drawer & Register Handling v1 — fully acknowledged
  ack('pol_cash_handling', 1, 'emp_sarah', 1800),
  ack('pol_cash_handling', 1, 'emp_mike', 1790),
  ack('pol_cash_handling', 1, 'emp_jordan', 1780),
  ack('pol_cash_handling', 1, 'emp_emily', 1770),
  ack('pol_cash_handling', 1, 'emp_carlos', 1760),
  ack('pol_cash_handling', 1, 'emp_priya', 1750),

  // Ladder & Elevated Work Safety v2 — 3 of 6
  ack('pol_ladder_safety', 2, 'emp_carlos', 700),
  ack('pol_ladder_safety', 2, 'emp_jordan', 690),
  ack('pol_ladder_safety', 2, 'emp_mike', 680),

  // Forklift & Pallet Jack Operation v1 — 3 of 6
  ack('pol_forklift', 1, 'emp_mike', 2400),
  ack('pol_forklift', 1, 'emp_carlos', 2390),
  ack('pol_forklift', 1, 'emp_jordan', 2380),
]
