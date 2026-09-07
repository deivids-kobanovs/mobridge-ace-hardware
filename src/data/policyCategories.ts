import { COMPANY_ID } from '@/data/employees'
import type { PolicyCategory } from '@/types'

export const POLICY_CATEGORIES: PolicyCategory[] = [
  { id: 'general', companyId: COMPANY_ID, name: 'General', sortOrder: 0, builtIn: true },
  { id: 'opening', companyId: COMPANY_ID, name: 'Opening Procedures', sortOrder: 1, builtIn: true },
  { id: 'closing', companyId: COMPANY_ID, name: 'Closing Procedures', sortOrder: 2, builtIn: true },
  { id: 'customer_service', companyId: COMPANY_ID, name: 'Customer Service', sortOrder: 3, builtIn: true },
  { id: 'safety', companyId: COMPANY_ID, name: 'Safety / HSE', sortOrder: 4, builtIn: true },
  { id: 'cleaning', companyId: COMPANY_ID, name: 'Cleaning', sortOrder: 5, builtIn: true },
  { id: 'equipment', companyId: COMPANY_ID, name: 'Equipment', sortOrder: 6, builtIn: true },
  { id: 'cash_handling', companyId: COMPANY_ID, name: 'Cash Handling', sortOrder: 7, builtIn: true },
  { id: 'inventory', companyId: COMPANY_ID, name: 'Inventory', sortOrder: 8, builtIn: true },
  { id: 'emergency', companyId: COMPANY_ID, name: 'Emergency Procedures', sortOrder: 9, builtIn: true },
  { id: 'maintenance', companyId: COMPANY_ID, name: 'Maintenance', sortOrder: 10, builtIn: true },
  { id: 'other', companyId: COMPANY_ID, name: 'Other', sortOrder: 11, builtIn: true },
]
