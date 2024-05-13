import { cors, logger as honoLogger } from "hono/middleware.ts";
import { Hono } from "hono/mod.ts";
import Logger from "logger";
import { jwtTokenChecker } from "./middleware/jwt-token-checker.ts";
import { todosRoute } from "./routes/todos.ts";
import { usersRoute } from "./routes/users.ts";

export const app = new Hono();

const logger = new Logger();
const customLogger = (message: string, ...rest: string[]) => {
	logger.info(message, ...rest);
};

app.use(
	cors({
		origin: Deno.env.get("FRONTEND_URL") ?? "http://localhost:5544",
		allowMethods: ["POST", "GET"],
		credentials: true,
	}),
);
app.use(honoLogger(customLogger));
app.use(jwtTokenChecker);
app.route("/users", usersRoute);
app.route("/todos", todosRoute);
