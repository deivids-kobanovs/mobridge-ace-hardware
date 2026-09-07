import { COMPANY_ID, LOCATION_ID } from '@/data/employees'
import type { Policy } from '@/types'

const now = new Date()

function daysAgoIso(days: number): string {
  return new Date(now.getTime() - days * 24 * 3600000).toISOString()
}

function base(p: Omit<Policy, 'companyId' | 'locationId' | 'createdAt'> & { createdDaysAgo: number }): Policy {
  const { createdDaysAgo, ...rest } = p
  return {
    companyId: COMPANY_ID,
    locationId: LOCATION_ID,
    createdAt: daysAgoIso(createdDaysAgo),
    ...rest,
  }
}

export const SEED_POLICIES: Policy[] = [
  base({
    id: 'pol_opening',
    title: 'Store Opening Procedure',
    description: 'Step-by-step routine for unlocking, disarming, and preparing the store before customers arrive.',
    categoryId: 'opening',
    originalLanguage: 'en',
    status: 'Published',
    version: 3,
    updatedAt: daysAgoIso(2),
    createdDaysAgo: 210,
    createdBy: 'Alex Rivera',
    updatedBy: 'Alex Rivera',
    publishedAt: daysAgoIso(2),
    requiresAcknowledgement: true,
    content:
      '## Purpose\n\nThis procedure ensures the store opens safely, consistently, and ready for customers every morning.\n\n## Steps\n\n1. Unlock the main entrance and disable the alarm system within 60 seconds.\n2. Turn on all sales-floor and stockroom lighting.\n3. Inspect both emergency exits to confirm they are unobstructed and unlocked from the inside.\n4. Count the opening cash drawer against the previous night\'s closing total.\n5. Check the front entrance and vestibule for cleanliness; sweep if needed.\n6. Review the overnight message log left by the closing associate.\n7. Complete the "Store Opening Checklist" task in Workgrid before unlocking customer doors.\n\n## Safety notes\n\n- Never prop open the emergency exits.\n- If the alarm does not disarm within 60 seconds, call the alarm monitoring company immediately — do not enter the sales floor.\n\n## Who this applies to\n\nAny associate scheduled as opening lead.',
    versions: [
      {
        policyId: 'pol_opening',
        version: 1,
        title: 'Store Opening Procedure',
        description: 'Step-by-step routine for unlocking, disarming, and preparing the store before customers arrive.',
        content: '## Steps\n\n1. Unlock the main entrance.\n2. Disable the alarm.\n3. Turn on lighting.\n4. Count registers.\n5. Complete the opening checklist.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(210),
        publishedBy: 'Alex Rivera',
      },
      {
        policyId: 'pol_opening',
        version: 2,
        title: 'Store Opening Procedure',
        description: 'Step-by-step routine for unlocking, disarming, and preparing the store before customers arrive.',
        content:
          '## Steps\n\n1. Unlock the main entrance and disable the alarm.\n2. Turn on all sales-floor and stockroom lighting.\n3. Inspect both emergency exits.\n4. Count the opening cash drawer.\n5. Review the overnight message log.\n6. Complete the opening checklist in Workgrid.',
        summaryOfChanges: 'Added emergency exit inspection and overnight message log review as required steps.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(65),
        publishedBy: 'Alex Rivera',
      },
      {
        policyId: 'pol_opening',
        version: 3,
        title: 'Store Opening Procedure',
        description: 'Step-by-step routine for unlocking, disarming, and preparing the store before customers arrive.',
        content:
          '## Purpose\n\nThis procedure ensures the store opens safely, consistently, and ready for customers every morning.\n\n## Steps\n\n1. Unlock the main entrance and disable the alarm system within 60 seconds.\n2. Turn on all sales-floor and stockroom lighting.\n3. Inspect both emergency exits to confirm they are unobstructed and unlocked from the inside.\n4. Count the opening cash drawer against the previous night\'s closing total.\n5. Check the front entrance and vestibule for cleanliness; sweep if needed.\n6. Review the overnight message log left by the closing associate.\n7. Complete the "Store Opening Checklist" task in Workgrid before unlocking customer doors.\n\n## Safety notes\n\n- Never prop open the emergency exits.\n- If the alarm does not disarm within 60 seconds, call the alarm monitoring company immediately — do not enter the sales floor.\n\n## Who this applies to\n\nAny associate scheduled as opening lead.',
        summaryOfChanges: 'Added a 60-second alarm disarm window and clarified the safety notes for a false alarm.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(2),
        publishedBy: 'Alex Rivera',
      },
    ],
  }),

  base({
    id: 'pol_closing',
    title: 'Store Closing Procedure',
    description: 'How to secure the building, cash, and equipment at the end of the day.',
    categoryId: 'closing',
    originalLanguage: 'en',
    status: 'Published',
    version: 4,
    updatedAt: daysAgoIso(5),
    createdDaysAgo: 300,
    createdBy: 'Alex Rivera',
    updatedBy: 'Alex Rivera',
    publishedAt: daysAgoIso(5),
    requiresAcknowledgement: true,
    content:
      '## Purpose\n\nA consistent closing routine protects the store, our cash, and our team.\n\n## Steps\n\n1. Announce last call 15 minutes before closing time.\n2. Clean and organize all checkout counters.\n3. Return misplaced merchandise to the correct aisles.\n4. Secure all outdoor displays and bring in seasonal signage.\n5. Check both emergency exits are closed and locked.\n6. Count down all registers and prepare the bank deposit.\n7. **Photograph the locked storage area** and attach it to the closing checklist.\n8. Empty all designated trash containers.\n9. Lock all entrances and set the alarm.\n10. Complete the final store walkthrough before leaving.\n11. Submit the closing checklist for manager approval in Workgrid.\n\n## Safety notes\n\n- Never leave the building alone after dark — closing must be done in pairs.\n- If the alarm fails to set, contact the on-call manager before leaving.',
    versions: [
      {
        policyId: 'pol_closing',
        version: 3,
        title: 'Store Closing Procedure',
        description: 'How to secure the building, cash, and equipment at the end of the day.',
        content:
          '## Steps\n\n1. Clean and organize checkout counters.\n2. Return misplaced merchandise.\n3. Secure outdoor displays.\n4. Check emergency exits.\n5. Count down registers.\n6. Empty trash containers.\n7. Lock entrances.\n8. Complete final walkthrough.\n9. Submit checklist for approval.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(96),
        publishedBy: 'Alex Rivera',
      },
      {
        policyId: 'pol_closing',
        version: 4,
        title: 'Store Closing Procedure',
        description: 'How to secure the building, cash, and equipment at the end of the day.',
        content:
          '## Purpose\n\nA consistent closing routine protects the store, our cash, and our team.\n\n## Steps\n\n1. Announce last call 15 minutes before closing time.\n2. Clean and organize all checkout counters.\n3. Return misplaced merchandise to the correct aisles.\n4. Secure all outdoor displays and bring in seasonal signage.\n5. Check both emergency exits are closed and locked.\n6. Count down all registers and prepare the bank deposit.\n7. **Photograph the locked storage area** and attach it to the closing checklist.\n8. Empty all designated trash containers.\n9. Lock all entrances and set the alarm.\n10. Complete the final store walkthrough before leaving.\n11. Submit the closing checklist for manager approval in Workgrid.\n\n## Safety notes\n\n- Never leave the building alone after dark — closing must be done in pairs.\n- If the alarm fails to set, contact the on-call manager before leaving.',
        summaryOfChanges: 'Employees must now photograph the locked storage area before completing the closing checklist. Also added the two-person closing safety rule.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(5),
        publishedBy: 'Alex Rivera',
      },
    ],
  }),

  base({
    id: 'pol_emergency',
    title: 'Emergency Evacuation Procedure',
    description: 'What every associate must do in the event of a fire, gas leak, or other emergency evacuation.',
    categoryId: 'emergency',
    originalLanguage: 'en',
    status: 'Published',
    version: 2,
    updatedAt: daysAgoIso(18),
    createdDaysAgo: 260,
    createdBy: 'Alex Rivera',
    updatedBy: 'Dana Whitfield',
    publishedAt: daysAgoIso(18),
    requiresAcknowledgement: true,
    content:
      '## Purpose\n\nEvery associate must know how to evacuate the building safely and account for coworkers and customers.\n\n## Steps\n\n1. When the alarm sounds, stop what you are doing immediately.\n2. Direct nearby customers to the nearest marked exit — do not use elevators.\n3. Do not stop to collect personal belongings.\n4. Proceed to the designated assembly point in the north parking lot.\n5. The shift lead will take a headcount against the scheduled roster.\n6. Do not re-enter the building until the fire department or a manager confirms it is safe.\n7. Report any missing coworker to the shift lead immediately.\n\n## Warnings\n\n- If you smell gas, do not use light switches or phones inside the building.\n- If you are trapped, call 911 and signal from a window if possible.',
    versions: [
      {
        policyId: 'pol_emergency',
        version: 1,
        title: 'Emergency Evacuation Procedure',
        description: 'What every associate must do in the event of a fire, gas leak, or other emergency evacuation.',
        content: '## Steps\n\n1. Stop what you are doing.\n2. Direct customers to the nearest exit.\n3. Proceed to the assembly point.\n4. Wait for a headcount.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(260),
        publishedBy: 'Alex Rivera',
      },
      {
        policyId: 'pol_emergency',
        version: 2,
        title: 'Emergency Evacuation Procedure',
        description: 'What every associate must do in the event of a fire, gas leak, or other emergency evacuation.',
        content:
          '## Purpose\n\nEvery associate must know how to evacuate the building safely and account for coworkers and customers.\n\n## Steps\n\n1. When the alarm sounds, stop what you are doing immediately.\n2. Direct nearby customers to the nearest marked exit — do not use elevators.\n3. Do not stop to collect personal belongings.\n4. Proceed to the designated assembly point in the north parking lot.\n5. The shift lead will take a headcount against the scheduled roster.\n6. Do not re-enter the building until the fire department or a manager confirms it is safe.\n7. Report any missing coworker to the shift lead immediately.\n\n## Warnings\n\n- If you smell gas, do not use light switches or phones inside the building.\n- If you are trapped, call 911 and signal from a window if possible.',
        summaryOfChanges: 'Added the gas-leak warning and clarified that the shift lead performs the headcount against the scheduled roster.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(18),
        publishedBy: 'Dana Whitfield',
      },
    ],
  }),

  base({
    id: 'pol_customer_complaints',
    title: 'Customer Complaint Handling',
    description: 'How to listen to, document, and resolve customer complaints on the sales floor.',
    categoryId: 'customer_service',
    originalLanguage: 'en',
    status: 'Published',
    version: 1,
    updatedAt: daysAgoIso(40),
    createdDaysAgo: 40,
    createdBy: 'Alex Rivera',
    updatedBy: 'Alex Rivera',
    publishedAt: daysAgoIso(40),
    requiresAcknowledgement: true,
    content:
      '## Steps\n\n1. Listen fully before responding — do not interrupt the customer.\n2. Apologize for the inconvenience, regardless of fault.\n3. Offer to resolve the issue on the spot when the fix costs under $25 (refund, exchange, or discount).\n4. For anything larger, page the manager on duty.\n5. Log the complaint in the customer service binder at the front desk with date, item, and resolution.\n\n## Tone\n\nAlways stay calm and professional, even if the customer is upset. Never argue with a customer on the sales floor.',
    versions: [
      {
        policyId: 'pol_customer_complaints',
        version: 1,
        title: 'Customer Complaint Handling',
        description: 'How to listen to, document, and resolve customer complaints on the sales floor.',
        content:
          '## Steps\n\n1. Listen fully before responding — do not interrupt the customer.\n2. Apologize for the inconvenience, regardless of fault.\n3. Offer to resolve the issue on the spot when the fix costs under $25 (refund, exchange, or discount).\n4. For anything larger, page the manager on duty.\n5. Log the complaint in the customer service binder at the front desk with date, item, and resolution.\n\n## Tone\n\nAlways stay calm and professional, even if the customer is upset. Never argue with a customer on the sales floor.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(40),
        publishedBy: 'Alex Rivera',
      },
    ],
  }),

  base({
    id: 'pol_cash_handling',
    title: 'Cash Drawer & Register Handling',
    description: 'Rules for counting, storing, and transporting cash safely at the registers.',
    categoryId: 'cash_handling',
    originalLanguage: 'en',
    status: 'Published',
    version: 1,
    updatedAt: daysAgoIso(80),
    createdDaysAgo: 80,
    createdBy: 'Alex Rivera',
    updatedBy: 'Alex Rivera',
    publishedAt: daysAgoIso(80),
    requiresAcknowledgement: true,
    content:
      '## Rules\n\n1. Never leave a register drawer open or unattended.\n2. Count your drawer at the start and end of every shift with a second associate present.\n3. Bills over $50 must be checked with a counterfeit pen.\n4. Drawers may never exceed $200 in cash — call a manager for a cash pickup above that amount.\n5. Bank deposits must always be carried by two people, never one.\n\n## Discrepancies\n\nAny drawer that is over or short by more than $5 must be reported to a manager the same day.',
    versions: [
      {
        policyId: 'pol_cash_handling',
        version: 1,
        title: 'Cash Drawer & Register Handling',
        description: 'Rules for counting, storing, and transporting cash safely at the registers.',
        content:
          '## Rules\n\n1. Never leave a register drawer open or unattended.\n2. Count your drawer at the start and end of every shift with a second associate present.\n3. Bills over $50 must be checked with a counterfeit pen.\n4. Drawers may never exceed $200 in cash — call a manager for a cash pickup above that amount.\n5. Bank deposits must always be carried by two people, never one.\n\n## Discrepancies\n\nAny drawer that is over or short by more than $5 must be reported to a manager the same day.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(80),
        publishedBy: 'Alex Rivera',
      },
    ],
  }),

  base({
    id: 'pol_ladder_safety',
    title: 'Ladder & Elevated Work Safety',
    description: 'Requirements for using ladders and order pickers safely in the warehouse and sales floor.',
    categoryId: 'safety',
    originalLanguage: 'en',
    status: 'Published',
    version: 2,
    updatedAt: daysAgoIso(30),
    createdDaysAgo: 150,
    createdBy: 'Dana Whitfield',
    updatedBy: 'Dana Whitfield',
    publishedAt: daysAgoIso(30),
    requiresAcknowledgement: true,
    content:
      '## Requirements\n\n1. Inspect the ladder for cracks, loose rungs, or damage before every use.\n2. Never stand on the top two rungs of any ladder.\n3. Always maintain three points of contact while climbing.\n4. A second associate must spot any ladder work above 8 feet.\n5. Tag and remove any damaged ladder from service immediately — notify a manager.\n\n## Order pickers\n\nOnly associates certified on the order picker may operate it. Certification records are kept with the store manager.',
    versions: [
      {
        policyId: 'pol_ladder_safety',
        version: 1,
        title: 'Ladder Safety',
        description: 'Requirements for using ladders safely in the warehouse and sales floor.',
        content: '## Requirements\n\n1. Inspect the ladder before use.\n2. Never stand on the top two rungs.\n3. Maintain three points of contact.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(150),
        publishedBy: 'Dana Whitfield',
      },
      {
        policyId: 'pol_ladder_safety',
        version: 2,
        title: 'Ladder & Elevated Work Safety',
        description: 'Requirements for using ladders and order pickers safely in the warehouse and sales floor.',
        content:
          '## Requirements\n\n1. Inspect the ladder for cracks, loose rungs, or damage before every use.\n2. Never stand on the top two rungs of any ladder.\n3. Always maintain three points of contact while climbing.\n4. A second associate must spot any ladder work above 8 feet.\n5. Tag and remove any damaged ladder from service immediately — notify a manager.\n\n## Order pickers\n\nOnly associates certified on the order picker may operate it. Certification records are kept with the store manager.',
        summaryOfChanges: 'Added order picker certification requirement and the spotter rule for ladder work above 8 feet.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(30),
        publishedBy: 'Dana Whitfield',
      },
    ],
  }),

  base({
    id: 'pol_cleaning_standards',
    title: 'Daily Cleaning Checklist Standards',
    description: 'Minimum cleaning expectations for the sales floor, restrooms, and breakroom.',
    categoryId: 'cleaning',
    originalLanguage: 'en',
    status: 'Published',
    version: 1,
    updatedAt: daysAgoIso(60),
    createdDaysAgo: 60,
    createdBy: 'Alex Rivera',
    updatedBy: 'Alex Rivera',
    publishedAt: daysAgoIso(60),
    requiresAcknowledgement: false,
    content:
      '## Sales floor\n\n- Sweep all aisles at least twice per shift.\n- Wipe down checkout counters every hour.\n\n## Restrooms\n\n- Check and restock every 2 hours; log on the restroom checklist.\n\n## Breakroom\n\n- Wipe tables after each break period.\n- Empty the breakroom trash at close.',
    versions: [
      {
        policyId: 'pol_cleaning_standards',
        version: 1,
        title: 'Daily Cleaning Checklist Standards',
        description: 'Minimum cleaning expectations for the sales floor, restrooms, and breakroom.',
        content:
          '## Sales floor\n\n- Sweep all aisles at least twice per shift.\n- Wipe down checkout counters every hour.\n\n## Restrooms\n\n- Check and restock every 2 hours; log on the restroom checklist.\n\n## Breakroom\n\n- Wipe tables after each break period.\n- Empty the breakroom trash at close.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(60),
        publishedBy: 'Alex Rivera',
      },
    ],
  }),

  base({
    id: 'pol_forklift',
    title: 'Forklift & Pallet Jack Operation',
    description: 'Certification and safe-operation rules for powered material-handling equipment.',
    categoryId: 'equipment',
    originalLanguage: 'en',
    status: 'Published',
    version: 1,
    updatedAt: daysAgoIso(100),
    createdDaysAgo: 100,
    createdBy: 'Dana Whitfield',
    updatedBy: 'Dana Whitfield',
    publishedAt: daysAgoIso(100),
    requiresAcknowledgement: true,
    content:
      '## Certification\n\nOnly associates with a current forklift certification on file with the store manager may operate the forklift.\n\n## Rules\n\n1. Complete the pre-shift inspection checklist before first use each day.\n2. Sound the horn at every blind corner and doorway.\n3. Never exceed a walking pace inside the building.\n4. Do not carry passengers or ride on the forks.\n5. Report any mechanical issue immediately and tag the equipment out of service.',
    versions: [
      {
        policyId: 'pol_forklift',
        version: 1,
        title: 'Forklift & Pallet Jack Operation',
        description: 'Certification and safe-operation rules for powered material-handling equipment.',
        content:
          '## Certification\n\nOnly associates with a current forklift certification on file with the store manager may operate the forklift.\n\n## Rules\n\n1. Complete the pre-shift inspection checklist before first use each day.\n2. Sound the horn at every blind corner and doorway.\n3. Never exceed a walking pace inside the building.\n4. Do not carry passengers or ride on the forks.\n5. Report any mechanical issue immediately and tag the equipment out of service.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(100),
        publishedBy: 'Dana Whitfield',
      },
    ],
  }),

  base({
    id: 'pol_cycle_count',
    title: 'Cycle Count Procedure',
    description: 'How weekly inventory cycle counts are assigned, performed, and reconciled.',
    categoryId: 'inventory',
    originalLanguage: 'en',
    status: 'Draft',
    version: 1,
    updatedAt: daysAgoIso(1),
    createdDaysAgo: 6,
    createdBy: 'Alex Rivera',
    updatedBy: 'Alex Rivera',
    requiresAcknowledgement: false,
    content:
      '## Draft — not yet published\n\n1. Each department lead counts their assigned aisles every Monday.\n2. Enter counts into the inventory system by end of shift.\n3. Variances over 5% are recounted the same day.\n4. Manager reviews and reconciles all variances by Wednesday.',
    versions: [],
  }),

  base({
    id: 'pol_maintenance_requests',
    title: 'Facility Maintenance Requests',
    description: 'How to report and track building or equipment issues that need repair.',
    categoryId: 'maintenance',
    originalLanguage: 'en',
    status: 'Published',
    version: 1,
    updatedAt: daysAgoIso(120),
    createdDaysAgo: 120,
    createdBy: 'Alex Rivera',
    updatedBy: 'Alex Rivera',
    publishedAt: daysAgoIso(120),
    requiresAcknowledgement: false,
    content:
      '## Steps\n\n1. Note the issue in the maintenance log at the service desk with date, location, and description.\n2. For anything safety-related (leaks, exposed wiring, broken glass), notify a manager immediately — do not wait for the log review.\n3. The manager reviews the log daily and schedules repairs with our vendor.\n4. Mark the log entry resolved once the repair is confirmed.',
    versions: [
      {
        policyId: 'pol_maintenance_requests',
        version: 1,
        title: 'Facility Maintenance Requests',
        description: 'How to report and track building or equipment issues that need repair.',
        content:
          '## Steps\n\n1. Note the issue in the maintenance log at the service desk with date, location, and description.\n2. For anything safety-related (leaks, exposed wiring, broken glass), notify a manager immediately — do not wait for the log review.\n3. The manager reviews the log daily and schedules repairs with our vendor.\n4. Mark the log entry resolved once the repair is confirmed.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(120),
        publishedBy: 'Alex Rivera',
      },
    ],
  }),

  base({
    id: 'pol_communication',
    title: 'Store Communication Standards',
    description: 'How shift handoffs, announcements, and manager messages should be shared with the team.',
    categoryId: 'general',
    originalLanguage: 'en',
    status: 'Published',
    version: 1,
    updatedAt: daysAgoIso(150),
    createdDaysAgo: 150,
    createdBy: 'Alex Rivera',
    updatedBy: 'Alex Rivera',
    publishedAt: daysAgoIso(150),
    requiresAcknowledgement: false,
    content:
      '## Shift handoff\n\nLeave a note in the overnight message log for anything the next shift needs to know.\n\n## Manager announcements\n\nManagers post store-wide announcements in Workgrid. Check your dashboard at the start of every shift.\n\n## Personal phones\n\nKeep personal phone use to the breakroom during scheduled breaks.',
    versions: [
      {
        policyId: 'pol_communication',
        version: 1,
        title: 'Store Communication Standards',
        description: 'How shift handoffs, announcements, and manager messages should be shared with the team.',
        content:
          '## Shift handoff\n\nLeave a note in the overnight message log for anything the next shift needs to know.\n\n## Manager announcements\n\nManagers post store-wide announcements in Workgrid. Check your dashboard at the start of every shift.\n\n## Personal phones\n\nKeep personal phone use to the breakroom during scheduled breaks.',
        originalLanguage: 'en',
        publishedAt: daysAgoIso(150),
        publishedBy: 'Alex Rivera',
      },
    ],
  }),
]
