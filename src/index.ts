import { app } from "./app.ts";

Deno.serve({ port: 8080 }, app.fetch);
