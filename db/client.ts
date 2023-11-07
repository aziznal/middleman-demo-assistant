import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

type DbType = PostgresJsDatabase<typeof schema>;

const createDbClient = (): DbType => {
  const connectionString = process.env.DATABASE_URL;
  const client = postgres(connectionString);
  return drizzle<typeof schema>(client);
};

const dbClient = createDbClient();

export default dbClient;
