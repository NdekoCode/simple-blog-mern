import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
export function consoleError(err) {
  if (process.env.NODE_ENV === "development") {
    console.log(err);
  }
}
export const __filename = dirname(fileURLToPath(import.meta.url));
export const __dirname = dirname(__filename);
