import { cors } from "hono/middleware.ts";
import { Hono } from "hono/mod.ts";
import { jwtTokenChecker } from "./middleware/jwt-token-checker.ts";
import { usersRoute } from "./routes/users.ts";

export const app = new Hono();

app.use(
	cors({
		origin: Deno.env.get("FRONTEND_URL") ?? "http://localhost:5544",
		allowMethods: ["POST", "GET"],
		credentials: true,
	}),
);
app.use(jwtTokenChecker);
app.route("/users", usersRoute);
