import { COMPANY_ID } from '@/data/employees'
import type { Handbook } from '@/types'

const now = Date.now()
function ago(days: number): string {
  return new Date(now - days * 24 * 3600000).toISOString()
}

export const SEED_HANDBOOK: Handbook = {
  companyId: COMPANY_ID,
  version: 3,
  originalLanguage: 'en',
  publishedAt: ago(10),
  updatedAt: ago(10),
  requiresFullAcknowledgement: true,
  sections: [
    {
      id: 'hb_welcome',
      handbookId: 'handbook_main',
      title: 'Welcome',
      sortOrder: 0,
      status: 'Published',
      requiresAcknowledgement: false,
      version: 2,
      updatedAt: ago(10),
      updatedBy: 'Alex Rivera',
      content:
        "Welcome to Mobridge Ace Hardware! We're glad you're here.\n\nThis handbook is your guide to how we work together as a team — our values, expectations, and the basics of day-to-day life at the store. It's meant to complement (not replace) the specific how-to instructions you'll find in Policies & Procedures.\n\nIf anything here is unclear, ask your manager. We'd rather you ask than guess.",
    },
    {
      id: 'hb_about',
      handbookId: 'handbook_main',
      title: 'About the Company',
      sortOrder: 1,
      status: 'Published',
      requiresAcknowledgement: false,
      version: 1,
      updatedAt: ago(180),
      updatedBy: 'Alex Rivera',
      content:
        "Mobridge Ace Hardware has served our community since 1998 as a locally owned member of the Ace Hardware cooperative. We're proud to be the neighborhood's helpful hardware store — combining local, personal service with the buying power and product range of a national brand.\n\nOur mission is simple: help our customers get their projects done right, the first time.",
    },
    {
      id: 'hb_hours',
      handbookId: 'handbook_main',
      title: 'Working Hours',
      sortOrder: 2,
      status: 'Published',
      requiresAcknowledgement: false,
      version: 2,
      updatedAt: ago(45),
      updatedBy: 'Alex Rivera',
      content:
        'Store hours are Monday–Saturday 7:00 AM–7:00 PM and Sunday 9:00 AM–5:00 PM.\n\nShifts are posted in Workgrid at least one week in advance. Please clock in no more than 5 minutes before your scheduled start time and clock out promptly at the end of your shift.\n\nIf you are running late, call the store directly — do not just send a text to a coworker.',
    },
    {
      id: 'hb_attendance',
      handbookId: 'handbook_main',
      title: 'Attendance',
      sortOrder: 3,
      status: 'Published',
      requiresAcknowledgement: false,
      version: 1,
      updatedAt: ago(180),
      updatedBy: 'Alex Rivera',
      content:
        'Reliable attendance keeps the store running and is fair to your teammates. Please give at least 4 hours notice for any absence, and as much notice as possible for a planned time-off request.\n\nThree unexcused absences in a rolling 90-day period will result in a conversation with your manager about scheduling.',
    },
    {
      id: 'hb_conduct',
      handbookId: 'handbook_main',
      title: 'Workplace Conduct',
      sortOrder: 4,
      status: 'Published',
      requiresAcknowledgement: true,
      version: 2,
      updatedAt: ago(10),
      updatedBy: 'Alex Rivera',
      content:
        "We treat customers and coworkers with respect, patience, and honesty — no exceptions.\n\n**Not tolerated, ever:**\n\n- Harassment or discrimination of any kind\n- Dishonesty with customers or in cash handling\n- Being under the influence of drugs or alcohol during a shift\n\nDress code: closed-toe shoes and your Mobridge Ace polo are required on the sales floor. Jeans or work pants are fine; no shorts.\n\nPersonal phones stay off the sales floor except during breaks.",
    },
    {
      id: 'hb_safety',
      handbookId: 'handbook_main',
      title: 'Safety',
      sortOrder: 5,
      status: 'Published',
      requiresAcknowledgement: true,
      version: 1,
      updatedAt: ago(180),
      updatedBy: 'Dana Whitfield',
      content:
        'Safety comes before speed, always. Report any hazard — a spill, a damaged shelf, a broken tool — the moment you see it, even if you did not cause it.\n\nDetailed safety procedures for specific tasks (ladders, forklifts, chemicals) live in Policies & Procedures. This section is about the mindset: if something feels unsafe, stop and ask.',
    },
    {
      id: 'hb_equipment',
      handbookId: 'handbook_main',
      title: 'Equipment',
      sortOrder: 6,
      status: 'Published',
      requiresAcknowledgement: false,
      version: 1,
      updatedAt: ago(180),
      updatedBy: 'Alex Rivera',
      content:
        'Store equipment (registers, scan guns, forklifts, radios) is for work use only. Report any malfunction to a manager right away rather than trying to fix it yourself.\n\nCertification is required before operating powered equipment — see the Equipment category in Policies & Procedures.',
    },
    {
      id: 'hb_vacation',
      handbookId: 'handbook_main',
      title: 'Vacation / Time Off',
      sortOrder: 7,
      status: 'Published',
      requiresAcknowledgement: false,
      version: 1,
      updatedAt: ago(180),
      updatedBy: 'Alex Rivera',
      content:
        'Full-time associates accrue paid time off starting on day one, available to use after 90 days. Part-time associates are eligible for prorated PTO after six months.\n\nSubmit time-off requests to your manager at least two weeks in advance where possible.',
    },
    {
      id: 'hb_confidentiality',
      handbookId: 'handbook_main',
      title: 'Confidentiality',
      sortOrder: 8,
      status: 'Published',
      requiresAcknowledgement: false,
      version: 1,
      updatedAt: ago(180),
      updatedBy: 'Alex Rivera',
      content:
        'Customer information, sales figures, and internal store data are confidential. Do not discuss them outside of work, including on personal social media.\n\nIf you are ever unsure whether something is okay to share, ask your manager first.',
    },
    {
      id: 'hb_contact',
      handbookId: 'handbook_main',
      title: 'Contact Information',
      sortOrder: 9,
      status: 'Published',
      requiresAcknowledgement: false,
      version: 1,
      updatedAt: ago(180),
      updatedBy: 'Alex Rivera',
      content:
        'Store Manager: Alex Rivera — alex.rivera@mobridgeacehardware.com\nAssistant Manager: Dana Whitfield — dana.whitfield@mobridgeacehardware.com\n\nStore phone: (605) 555-0142\nAddress: 412 Grand Crossing, Mobridge, SD 57601',
    },
  ],
}
