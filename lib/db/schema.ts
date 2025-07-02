import { sqliteTable, text, integer, real, blob, sql } from 'drizzle-orm/sqlite-core';

export const dashboardData = sqliteTable('dashboard_data', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  category: text('category').notNull(),
  value: real('value').notNull(),
  date: text('date').notNull(),
  metric: text('metric').notNull(),
  source: text('source'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insights = sqliteTable('insights', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(), // 'trend', 'anomaly', 'recommendation'
  severity: text('severity').notNull(), // 'low', 'medium', 'high'
  data: blob('data', { mode: 'json' }),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
});

export const userPreferences = sqliteTable('user_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type DashboardData = typeof dashboardData.$inferSelect;
export type NewDashboardData = typeof dashboardData.$inferInsert;
export type Insight = typeof insights.$inferSelect;
export type NewInsight = typeof insights.$inferInsert;
export type UserPreference = typeof userPreferences.$inferSelect;
export type NewUserPreference = typeof userPreferences.$inferInsert; 