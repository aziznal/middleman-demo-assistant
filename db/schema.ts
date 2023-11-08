import { relations } from "drizzle-orm";
import { pgTable, uuid, text, index, integer } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    email: text("email").notNull(),
  },
  (table) => ({
    emailIndex: index("email_index").on(table.email),
  })
);

export const userRelations = relations(users, ({ many }) => ({
  services: many(services),
  assistantThreads: many(usersToAssistantThreads),
}));

export const services = pgTable(
  "services",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    workingHours: text("working_hours").notNull(),
    rating: integer("rating").notNull(),
  },
  (table) => ({
    titleIndex: index("title_index").on(table.title),
  })
);

export const serviceRelations = relations(services, ({ one }) => ({
  user: one(users, {
    fields: [services.userId],
    references: [users.id],
  }),
}));

export const assistantThreads = pgTable(
  "assistant_threads",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    threadId: text("thread_id").notNull(),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.userId),
    threadIdIndex: index("thread_id_index").on(table.threadId),
  })
);

export const assistantThreadRelations = relations(
  assistantThreads,
  ({ many }) => ({
    users: many(usersToAssistantThreads),
  })
);

export const usersToAssistantThreads = pgTable(
  "users_to_assistant_threads",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    assistantThreadId: uuid("assistant_thread_id")
      .notNull()
      .references(() => assistantThreads.id),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.userId),
    assistantThreadIdIndex: index("assistant_thread_id_index").on(
      table.assistantThreadId
    ),
  })
);

export const usersToAssistantThreadRelations = relations(
  usersToAssistantThreads,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToAssistantThreads.userId],
      references: [users.id],
    }),
    assistantThread: one(assistantThreads, {
      fields: [usersToAssistantThreads.assistantThreadId],
      references: [assistantThreads.id],
    }),
  })
);
