import { env } from "hono/helper.ts";
import { cors } from "hono/middleware.ts";
import { Hono } from "hono/mod.ts";
import { usersRoute } from "./routes/users.ts";

const app = new Hono();

app.use("/*", (c) => {
	const { FRONTEND_URL } = env<{ FRONTEND_URL: string }>(c);
	return cors({
		origin: [FRONTEND_URL, "http://localhost:5544"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		credentials: true,
	});
});
app.route("/users", usersRoute);

Deno.serve({ port: 8080 }, app.fetch);
