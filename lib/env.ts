import { config } from "dotenv";

config({ path: ".env.local" });

export const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;