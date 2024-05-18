import { cors } from "hono/middleware.ts";
import { Hono } from "hono/mod.ts";
import { honoLoggerMiddleware } from "./libs/clerk.ts";
import { jwtTokenChecker } from "./middleware/jwt-token-checker.ts";
import { invitationsRoute } from "./routes/invitations.ts";
import { permissionsRoute } from "./routes/permissions.ts";
import { rolesRoute } from "./routes/roles.ts";
import { todosRoute } from "./routes/todos.ts";
import { usersRoute } from "./routes/users.ts";

export const app = new Hono();

app.use(
	cors({
		origin: Deno.env.get("FRONTEND_URL") ?? "http://localhost:5544",
		allowMethods: ["POST", "GET"],
		credentials: true,
	}),
);
app.use(honoLoggerMiddleware);
app.use(jwtTokenChecker);
app.route("/users", usersRoute);
app.route("/todos", todosRoute);
app.route("/roles", rolesRoute);
app.route("/permissions", permissionsRoute);
app.route("/invitations", invitationsRoute);
