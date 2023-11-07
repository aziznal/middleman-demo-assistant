import { pgTable, uuid, text, index, integer } from "drizzle-orm/pg-core";

export const services = pgTable(
  "services",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    workingHours: text("working_hours").notNull(),
    rating: integer("rating").notNull(),
  },
  (table) => ({
    titleIndex: index("title_index").on(table.title),
  })
);
