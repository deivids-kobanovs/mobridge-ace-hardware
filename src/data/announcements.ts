import { makeId } from '@/lib/id'
import type { Announcement } from '@/types'

function minsAgo(n: number) {
  return new Date(Date.now() - n * 60000).toISOString()
}

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: makeId('ann'),
    timestamp: minsAgo(90),
    author: 'Alex Rivera',
    message: 'Reminder: the loading dock pallet jack is out of service until this afternoon. Flag anything blocked by it so we can route around it.',
  },
  {
    id: makeId('ann'),
    timestamp: minsAgo(60 * 20),
    author: 'Alex Rivera',
    message: 'Great close last night, team. Corporate walkthrough is Thursday — let\'s keep the endcaps sharp all week.',
  },
  {
    id: makeId('ann'),
    timestamp: minsAgo(60 * 44),
    author: 'Dana Whitfield',
    message: 'Fall planogram reset kits arrived in receiving. Check with me before starting your section reset.',
  },
]
