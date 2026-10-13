import { relations, sql } from 'drizzle-orm'
import {
  check,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { organization, user } from './auth-schema'

export const tradeType = pgEnum('trade_type', ['buy', 'sell'])

export const position = pgTable(
  'position',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    symbol: text('symbol').notNull(),
    quantity: integer('quantity').notNull(),
  },
  (t) => [
    uniqueIndex('position_user_symbol_idx').on(t.userId, t.symbol),
    check('position_quantity_positive', sql`${t.quantity} > 0`),
  ]
)

export const trade = pgTable(
  'trade',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: tradeType('type').notNull(),
    symbol: text('symbol').notNull(),
    quantity: integer('quantity').notNull(),
    priceCents: integer('price_cents').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('trade_user_created_idx').on(t.userId, t.createdAt),
    check('trade_quantity_positive', sql`${t.quantity} > 0`),
  ]
)

/** End-of-day close per symbol, written by the daily snapshot job. */
export const priceSnapshot = pgTable(
  'price_snapshot',
  {
    symbol: text('symbol').notNull(),
    date: date('date').notNull(),
    closeCents: integer('close_cents').notNull(),
  },
  (t) => [primaryKey({ columns: [t.symbol, t.date] })]
)

/** End-of-day portfolio value per user, written by the daily snapshot job. */
export const portfolioSnapshot = pgTable(
  'portfolio_snapshot',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    cashCents: integer('cash_cents').notNull(),
    holdingsCents: integer('holdings_cents').notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.date] })]
)

export const studentAuditAction = pgEnum('student_audit_action', [
  'rename',
  'password_reset',
])

/** Teacher actions taken on student accounts. */
export const studentAudit = pgTable(
  'student_audit',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    actorId: text('actor_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    action: studentAuditAction('action').notNull(),
    detail: jsonb('detail').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('student_audit_org_idx').on(t.organizationId, t.createdAt)]
)

export const positionRelations = relations(position, ({ one }) => ({
  user: one(user, { fields: [position.userId], references: [user.id] }),
}))

export const tradeRelations = relations(trade, ({ one }) => ({
  user: one(user, { fields: [trade.userId], references: [user.id] }),
}))

export const classroomRequestStatus = pgEnum('classroom_request_status', [
  'pending',
  'approved',
  'rejected',
])

/** A teacher asking for a classroom. Admins approve or reject. */
export const classroomRequest = pgTable(
  'classroom_request',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    schoolName: text('school_name').notNull(),
    className: text('class_name').notNull(),
    expectedStudents: integer('expected_students').notNull(),
    message: text('message'),
    status: classroomRequestStatus('status').default('pending').notNull(),
    rejectionReason: text('rejection_reason'),
    organizationId: text('organization_id').references(() => organization.id, {
      onDelete: 'set null',
    }),
    reviewedBy: text('reviewed_by').references(() => user.id, {
      onDelete: 'set null',
    }),
    reviewedAt: timestamp('reviewed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('classroom_request_status_idx').on(t.status, t.createdAt),
    // At most one pending request per user.
    uniqueIndex('classroom_request_one_pending_idx')
      .on(t.userId)
      .where(sql`${t.status} = 'pending'`),
  ]
)
