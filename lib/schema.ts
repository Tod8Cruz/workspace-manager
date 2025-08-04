import { pgTable, serial, text, varchar, timestamp, boolean, integer, date, decimal } from 'drizzle-orm/pg-core';

// Employers table
export const employers = pgTable('employers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  industry: varchar('industry', { length: 100 }),
  employeeCount: integer('employee_count'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Employees table (related to employers)
export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  employerId: integer('employer_id').references(() => employers.id),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  position: varchar('position', { length: 100 }),
  department: varchar('department', { length: 100 }),
  hireDate: date('hire_date'),
  salary: decimal('salary', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Time logs table
export const timeLogs = pgTable('time_logs', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id),
  clockIn: timestamp('clock_in'),
  clockOut: timestamp('clock_out'),
  totalHours: decimal('total_hours', { precision: 5, scale: 2 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Leave requests table
export const leaveRequests = pgTable('leave_requests', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  leaveType: varchar('leave_type', { length: 50 }).notNull(), // vacation, sick, personal, etc.
  reason: text('reason'),
  status: varchar('status', { length: 20 }).default('pending'), // pending, approved, rejected
  approvedBy: integer('approved_by').references(() => employees.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Expense claims table
export const expenseClaims = pgTable('expense_claims', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }),
  receiptUrl: text('receipt_url'),
  status: varchar('status', { length: 20 }).default('pending'), // pending, approved, rejected
  approvedBy: integer('approved_by').references(() => employees.id),
  submittedAt: timestamp('submitted_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Contracts table
export const contracts = pgTable('contracts', {
  id: serial('id').primaryKey(),
  employerId: integer('employer_id').references(() => employers.id),
  employeeId: integer('employee_id').references(() => employees.id),
  contractType: varchar('contract_type', { length: 50 }).notNull(), // full-time, part-time, contract
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  salary: decimal('salary', { precision: 10, scale: 2 }),
  terms: text('terms'),
  status: varchar('status', { length: 20 }).default('active'), // active, terminated, expired
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Notifications table
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').references(() => employees.id),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // info, warning, error, success
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Employer = typeof employers.$inferSelect;
export type NewEmployer = typeof employers.$inferInsert;
export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
export type TimeLog = typeof timeLogs.$inferSelect;
export type NewTimeLog = typeof timeLogs.$inferInsert;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type NewLeaveRequest = typeof leaveRequests.$inferInsert;
export type ExpenseClaim = typeof expenseClaims.$inferSelect;
export type NewExpenseClaim = typeof expenseClaims.$inferInsert;
export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert; 