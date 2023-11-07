import { pgTable, uuid, text, boolean, index } from "drizzle-orm/pg-core";

export const todos = pgTable(
  "todos",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    completed: boolean("completed").notNull().default(false),
  },
  (table) => ({
    titleIndex: index("title_index").on(table.title),
  })
);
