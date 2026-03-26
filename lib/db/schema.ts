import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  decimal,
  date,
  timestamp,
} from 'drizzle-orm/pg-core'

// ─── ENUMS ────────────────────────────────────────────────────────────────────

export const roleEnum = pgEnum('role', [
  'MEMBER',
  'DEPT_HEAD',
  'FINANCE_OFFICER',
  'ADMIN',
])

export const departmentTypeEnum = pgEnum('department_type', [
  'YOUTH',
  'WOMENS_FELLOWSHIP',
  'MENS_FELLOWSHIP',
  'SUNDAY_SCHOOL',
  'CADET_STAR',
])

export const serviceTypeEnum = pgEnum('service_type', [
  'SUNDAY_SERVICE',
  'MIDWEEK',
  'PRAYER',
  'SPECIAL',
])

export const eventTypeEnum = pgEnum('event_type', [
  'GENERAL',
  'RALLY',
  'AGM',
  'CONFERENCE',
  'SPECIAL',
])

export const fundTypeEnum = pgEnum('fund_type', [
  'TITHE',
  'OFFERING',
  'BUILDING',
  'BENEVOLENCE',
  'GENERAL',
])

export const contributionTypeEnum = pgEnum('contribution_type', [
  'TITHE',
  'OFFERING',
  'PLEDGE',
  'DONATION',
])

export const paymentMethodEnum = pgEnum('payment_method', [
  'CASH',
  'MPESA',
  'BANK_TRANSFER',
  'OTHER',
])

export const expenseCategoryEnum = pgEnum('expense_category', [
  'MINISTRY',
  'UTILITIES',
  'MAINTENANCE',
  'SALARIES',
  'OTHER',
])

export const councilEnum = pgEnum('council', [
  'DCC',
  'RCC',
  'ACC',
  'CCC',
])

// Phase 2
export const accountTypeEnum = pgEnum('account_type', [
  'ASSET',
  'LIABILITY',
  'EQUITY',
  'REVENUE',
  'EXPENSE',
])

// ─── IDENTITY DOMAIN ──────────────────────────────────────────────────────────

export const members = pgTable('members', {
  id:           uuid('id').primaryKey().defaultRandom(),
  name:         varchar('name', { length: 255 }).notNull(),
  email:        varchar('email', { length: 255 }).notNull().unique(),
  phone:        varchar('phone', { length: 20 }),
  passwordHash: text('password_hash').notNull(),
  role:         roleEnum('role').notNull().default('MEMBER'),
  dateOfBirth:  date('date_of_birth'),
  joinedDate:   date('joined_date'),
  avatarUrl:    text('avatar_url'),           // Sanity asset URL
  isActive:     boolean('is_active').notNull().default(true),
  createdAt:    timestamp('created_at').notNull().defaultNow(),
})

// ─── MINISTRY DOMAIN ──────────────────────────────────────────────────────────

export const ministryDepartments = pgTable('ministry_departments', {
  id:          uuid('id').primaryKey().defaultRandom(),
  name:        varchar('name', { length: 255 }).notNull(),
  type:        departmentTypeEnum('type').notNull().unique(),
  description: text('description'),
  headId:      uuid('head_id').references(() => members.id),
  imageUrl:    text('image_url'),             // Sanity asset URL
  bannerUrl:   text('banner_url'),            // Sanity asset URL
  isActive:    boolean('is_active').notNull().default(true),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
})

export const departmentMemberships = pgTable('department_memberships', {
  id:           uuid('id').primaryKey().defaultRandom(),
  memberId:     uuid('member_id').notNull().references(() => members.id),
  departmentId: uuid('department_id').notNull().references(() => ministryDepartments.id),
  joinedAt:     timestamp('joined_at').notNull().defaultNow(),
  leftAt:       timestamp('left_at'),
  isActive:     boolean('is_active').notNull().default(true),
})

// ─── SERVICES DOMAIN ──────────────────────────────────────────────────────────

export const services = pgTable('services', {
  id:          uuid('id').primaryKey().defaultRandom(),
  title:       varchar('title', { length: 255 }).notNull(),
  type:        serviceTypeEnum('type').notNull(),
  date:        date('date').notNull(),
  time:        varchar('time', { length: 10 }),
  description: text('description'),
  officiantId: uuid('officiant_id').references(() => members.id),
  notes:       text('notes'),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
})

export const attendanceRecords = pgTable('attendance_records', {
  id:           uuid('id').primaryKey().defaultRandom(),
  serviceId:    uuid('service_id').notNull().references(() => services.id),
  memberId:     uuid('member_id').notNull().references(() => members.id),
  departmentId: uuid('department_id').references(() => ministryDepartments.id),
  recordedBy:   uuid('recorded_by').notNull().references(() => members.id),
  createdAt:    timestamp('created_at').notNull().defaultNow(),
})

// ─── EVENTS DOMAIN ────────────────────────────────────────────────────────────

export const events = pgTable('events', {
  id:           uuid('id').primaryKey().defaultRandom(),
  title:        varchar('title', { length: 255 }).notNull(),
  type:         eventTypeEnum('type').notNull().default('GENERAL'),
  description:  text('description'),
  departmentId: uuid('department_id').references(() => ministryDepartments.id),
  startDate:    date('start_date').notNull(),
  endDate:      date('end_date'),
  location:     text('location'),
  capacity:     integer('capacity'),
  bannerUrl:    text('banner_url'),           // Sanity asset URL
  isPublished:  boolean('is_published').notNull().default(false),
  createdBy:    uuid('created_by').notNull().references(() => members.id),
  createdAt:    timestamp('created_at').notNull().defaultNow(),
})

export const eventRegistrations = pgTable('event_registrations', {
  id:           uuid('id').primaryKey().defaultRandom(),
  eventId:      uuid('event_id').notNull().references(() => events.id),
  memberId:     uuid('member_id').notNull().references(() => members.id),
  registeredAt: timestamp('registered_at').notNull().defaultNow(),
  attended:     boolean('attended').notNull().default(false),
})

// ─── FINANCE DOMAIN ───────────────────────────────────────────────────────────

export const funds = pgTable('funds', {
  id:           uuid('id').primaryKey().defaultRandom(),
  name:         varchar('name', { length: 255 }).notNull(),
  type:         fundTypeEnum('type').notNull(),
  description:  text('description'),
  targetAmount: decimal('target_amount', { precision: 12, scale: 2 }),
  isActive:     boolean('is_active').notNull().default(true),
  createdAt:    timestamp('created_at').notNull().defaultNow(),
})

export const contributions = pgTable('contributions', {
  id:            uuid('id').primaryKey().defaultRandom(),
  memberId:      uuid('member_id').notNull().references(() => members.id),
  fundId:        uuid('fund_id').notNull().references(() => funds.id),
  amount:        decimal('amount', { precision: 12, scale: 2 }).notNull(),
  type:          contributionTypeEnum('type').notNull(),
  method:        paymentMethodEnum('method').notNull(),
  referenceNo:   varchar('reference_no', { length: 100 }),
  contributedAt: timestamp('contributed_at').notNull().defaultNow(),
  recordedBy:    uuid('recorded_by').notNull().references(() => members.id),
  notes:         text('notes'),
})

export const receipts = pgTable('receipts', {
  id:             uuid('id').primaryKey().defaultRandom(),
  contributionId: uuid('contribution_id').notNull().references(() => contributions.id),
  receiptNo:      integer('receipt_no').notNull().unique(),
  issuedAt:       timestamp('issued_at').notNull().defaultNow(),
  issuedBy:       uuid('issued_by').notNull().references(() => members.id),
})

export const expenses = pgTable('expenses', {
  id:          uuid('id').primaryKey().defaultRandom(),
  fundId:      uuid('fund_id').notNull().references(() => funds.id),
  title:       varchar('title', { length: 255 }).notNull(),
  category:    expenseCategoryEnum('category').notNull(),
  amount:      decimal('amount', { precision: 12, scale: 2 }).notNull(),
  date:        date('date').notNull(),
  description: text('description'),
  approvedBy:  uuid('approved_by').references(() => members.id),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
})

export const remittanceRates = pgTable('remittance_rates', {
  id:            uuid('id').primaryKey().defaultRandom(),
  council:       councilEnum('council').notNull(),
  ratePercent:   decimal('rate_percent', { precision: 5, scale: 2 }).notNull(),
  effectiveFrom: date('effective_from').notNull(),
  effectiveTo:   date('effective_to'),
  isActive:      boolean('is_active').notNull().default(true),
  createdBy:     uuid('created_by').notNull().references(() => members.id),
})

export const remittancePayments = pgTable('remittance_payments', {
  id:          uuid('id').primaryKey().defaultRandom(),
  council:     councilEnum('council').notNull(),
  period:      varchar('period', { length: 7 }).notNull(), // e.g. '2026-03'
  amountDue:   decimal('amount_due', { precision: 12, scale: 2 }).notNull(),
  amountPaid:  decimal('amount_paid', { precision: 12, scale: 2 }).notNull().default('0'),
  paidAt:      timestamp('paid_at'),
  referenceNo: varchar('reference_no', { length: 100 }),
  recordedBy:  uuid('recorded_by').notNull().references(() => members.id),
})

// ─── ACCOUNTING DOMAIN — PHASE 2 ──────────────────────────────────────────────

export const accounts = pgTable('accounts', {
  id:   uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  type: accountTypeEnum('type').notNull(),
  code: varchar('code', { length: 20 }).notNull().unique(),
})

export const journalEntries = pgTable('journal_entries', {
  id:          uuid('id').primaryKey().defaultRandom(),
  date:        date('date').notNull(),
  description: text('description').notNull(),
  createdBy:   uuid('created_by').notNull().references(() => members.id),
  createdAt:   timestamp('created_at').notNull().defaultNow(),
})

export const journalLines = pgTable('journal_lines', {
  id:             uuid('id').primaryKey().defaultRandom(),
  journalEntryId: uuid('journal_entry_id').notNull().references(() => journalEntries.id),
  accountId:      uuid('account_id').notNull().references(() => accounts.id),
  debit:          decimal('debit', { precision: 12, scale: 2 }).notNull().default('0'),
  credit:         decimal('credit', { precision: 12, scale: 2 }).notNull().default('0'),
})

// Add this to your existing schema
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id:        uuid('id').primaryKey().defaultRandom(),
  memberId:  uuid('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  token:     text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt:    timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow(),
})