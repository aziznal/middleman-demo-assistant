export interface ProcessEnv {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";

      /** The database host */
      DATABASE_HOST: string;

      /** The full connection URL for connecting to the database */
      DATABASE_URL: string;

      /** The database password */
      DATABASE_PASSWORD: string;

      /** The OpenAI API key for using the assistants and functions api */
      OPEN_AI_API_KEY: string;
    }
  }
}
