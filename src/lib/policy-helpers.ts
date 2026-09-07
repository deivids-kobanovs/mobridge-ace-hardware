import { EMPLOYEES } from '@/data/employees'
import type { HandbookAcknowledgement, Policy, PolicyAcknowledgement } from '@/types'

export interface AckStats {
  total: number
  acknowledgedCount: number
  percent: number
  acknowledgedIds: string[]
  pendingIds: string[]
}

export function policyAckStats(policy: Policy, acknowledgements: PolicyAcknowledgement[], roster: string[] = EMPLOYEES.map((e) => e.id)): AckStats {
  const acked = acknowledgements.filter((a) => a.policyId === policy.id && a.policyVersion === policy.version)
  const ackedIds = new Set(acked.map((a) => a.employeeId))
  const acknowledgedIds = roster.filter((id) => ackedIds.has(id))
  const pendingIds = roster.filter((id) => !ackedIds.has(id))
  return {
    total: roster.length,
    acknowledgedCount: acknowledgedIds.length,
    percent: roster.length ? Math.round((acknowledgedIds.length / roster.length) * 100) : 0,
    acknowledgedIds,
    pendingIds,
  }
}

export function handbookAckStats(version: number, acknowledgements: HandbookAcknowledgement[], roster: string[] = EMPLOYEES.map((e) => e.id)): AckStats {
  const acked = acknowledgements.filter((a) => a.handbookVersion === version)
  const ackedIds = new Set(acked.map((a) => a.employeeId))
  const acknowledgedIds = roster.filter((id) => ackedIds.has(id))
  const pendingIds = roster.filter((id) => !ackedIds.has(id))
  return {
    total: roster.length,
    acknowledgedCount: acknowledgedIds.length,
    percent: roster.length ? Math.round((acknowledgedIds.length / roster.length) * 100) : 0,
    acknowledgedIds,
    pendingIds,
  }
}

export function hasAcknowledgedPolicy(policy: Policy, employeeId: string, acknowledgements: PolicyAcknowledgement[]): boolean {
  return acknowledgements.some((a) => a.policyId === policy.id && a.policyVersion === policy.version && a.employeeId === employeeId)
}

export function hasAcknowledgedHandbook(version: number, employeeId: string, acknowledgements: HandbookAcknowledgement[]): boolean {
  return acknowledgements.some((a) => a.handbookVersion === version && a.employeeId === employeeId)
}

export function policiesUpdatedWithinDays(policies: Policy[], days: number): Policy[] {
  const cutoff = Date.now() - days * 24 * 3600000
  return policies.filter((p) => p.status === 'Published' && !p.archived && new Date(p.updatedAt).getTime() >= cutoff)
}
