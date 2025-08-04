import { db } from './db';
import { employers, employees, timeLogs, leaveRequests, expenseClaims, contracts, notifications } from './schema';
import { eq, and, desc, count } from 'drizzle-orm';
import type { NewEmployer, NewEmployee, NewTimeLog, NewLeaveRequest, NewExpenseClaim, NewContract, NewNotification } from './schema';

// Employer utilities
export const employerUtils = {
  async getAll() {
    return await db.select().from(employers).orderBy(desc(employers.createdAt));
  },

  async getById(id: number) {
    const result = await db.select().from(employers).where(eq(employers.id, id));
    return result[0] || null;
  },

  async create(data: NewEmployer) {
    const result = await db.insert(employers).values(data).returning();
    return result[0];
  },

  async update(id: number, data: Partial<NewEmployer>) {
    const result = await db
      .update(employers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(employers.id, id))
      .returning();
    return result[0];
  },

  async delete(id: number) {
    await db.delete(employers).where(eq(employers.id, id));
  },

  async getEmployeeCount(id: number) {
    const result = await db
      .select({ count: count() })
      .from(employees)
      .where(eq(employees.employerId, id));
    return result[0]?.count || 0;
  },
};

// Employee utilities
export const employeeUtils = {
  async getAll() {
    return await db
      .select({
        employee: employees,
        employer: {
          id: employers.id,
          name: employers.name,
          companyName: employers.companyName,
        },
      })
      .from(employees)
      .leftJoin(employers, eq(employees.employerId, employers.id))
      .orderBy(desc(employees.createdAt));
  },

  async getById(id: number) {
    const result = await db
      .select({
        employee: employees,
        employer: {
          id: employers.id,
          name: employers.name,
          companyName: employers.companyName,
        },
      })
      .from(employees)
      .leftJoin(employers, eq(employees.employerId, employers.id))
      .where(eq(employees.id, id));
    return result[0] || null;
  },

  async getByEmployer(employerId: number) {
    return await db
      .select()
      .from(employees)
      .where(eq(employees.employerId, employerId))
      .orderBy(desc(employees.createdAt));
  },

  async create(data: NewEmployee) {
    const result = await db.insert(employees).values(data).returning();
    return result[0];
  },

  async update(id: number, data: Partial<NewEmployee>) {
    const result = await db
      .update(employees)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return result[0];
  },

  async delete(id: number) {
    await db.delete(employees).where(eq(employees.id, id));
  },
};

// Time log utilities
export const timeLogUtils = {
  async getByEmployee(employeeId: number) {
    return await db
      .select()
      .from(timeLogs)
      .where(eq(timeLogs.employeeId, employeeId))
      .orderBy(desc(timeLogs.createdAt));
  },

  async create(data: NewTimeLog) {
    const result = await db.insert(timeLogs).values(data).returning();
    return result[0];
  },

  async update(id: number, data: Partial<NewTimeLog>) {
    const result = await db
      .update(timeLogs)
      .set(data)
      .where(eq(timeLogs.id, id))
      .returning();
    return result[0];
  },
};

// Leave request utilities
export const leaveRequestUtils = {
  async getByEmployee(employeeId: number) {
    return await db
      .select()
      .from(leaveRequests)
      .where(eq(leaveRequests.employeeId, employeeId))
      .orderBy(desc(leaveRequests.createdAt));
  },

  async getPending() {
    return await db
      .select()
      .from(leaveRequests)
      .where(eq(leaveRequests.status, 'pending'))
      .orderBy(desc(leaveRequests.createdAt));
  },

  async create(data: NewLeaveRequest) {
    const result = await db.insert(leaveRequests).values(data).returning();
    return result[0];
  },

  async updateStatus(id: number, status: string, approvedBy?: number) {
    const result = await db
      .update(leaveRequests)
      .set({ status, approvedBy, updatedAt: new Date() })
      .where(eq(leaveRequests.id, id))
      .returning();
    return result[0];
  },
};

// Expense claim utilities
export const expenseClaimUtils = {
  async getByEmployee(employeeId: number) {
    return await db
      .select()
      .from(expenseClaims)
      .where(eq(expenseClaims.employeeId, employeeId))
      .orderBy(desc(expenseClaims.submittedAt));
  },

  async getPending() {
    return await db
      .select()
      .from(expenseClaims)
      .where(eq(expenseClaims.status, 'pending'))
      .orderBy(desc(expenseClaims.submittedAt));
  },

  async create(data: NewExpenseClaim) {
    const result = await db.insert(expenseClaims).values(data).returning();
    return result[0];
  },

  async updateStatus(id: number, status: string, approvedBy?: number) {
    const result = await db
      .update(expenseClaims)
      .set({ status, approvedBy, updatedAt: new Date() })
      .where(eq(expenseClaims.id, id))
      .returning();
    return result[0];
  },
};

// Contract utilities
export const contractUtils = {
  async getByEmployer(employerId: number) {
    return await db
      .select()
      .from(contracts)
      .where(eq(contracts.employerId, employerId))
      .orderBy(desc(contracts.createdAt));
  },

  async getByEmployee(employeeId: number) {
    return await db
      .select()
      .from(contracts)
      .where(eq(contracts.employeeId, employeeId))
      .orderBy(desc(contracts.createdAt));
  },

  async create(data: NewContract) {
    const result = await db.insert(contracts).values(data).returning();
    return result[0];
  },

  async update(id: number, data: Partial<NewContract>) {
    const result = await db
      .update(contracts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(contracts.id, id))
      .returning();
    return result[0];
  },
};

// Notification utilities
export const notificationUtils = {
  async getByEmployee(employeeId: number) {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.employeeId, employeeId))
      .orderBy(desc(notifications.createdAt));
  },

  async getUnread(employeeId: number) {
    return await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.employeeId, employeeId), eq(notifications.isRead, false)))
      .orderBy(desc(notifications.createdAt));
  },

  async create(data: NewNotification) {
    const result = await db.insert(notifications).values(data).returning();
    return result[0];
  },

  async markAsRead(id: number) {
    const result = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return result[0];
  },
}; 