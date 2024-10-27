import { logger as honoLogger } from "hono/middleware.ts";
import Logger from "logger";

const logger = new Logger();

export const clerk = {
	info(...args: unknown[]) {
		if (Deno.env.get("DENO_ENV") !== "test") {
			logger.info(...args);
		}
	},
	warn(...args: unknown[]) {
		if (Deno.env.get("DENO_ENV") !== "test") {
			logger.warn(...args);
		}
	},
	error(...args: unknown[]) {
		if (Deno.env.get("DENO_ENV") !== "test") {
			logger.error(...args);
		}
	},
};

const customLogger = (message: string, ...rest: string[]) => {
	clerk.info(message, ...rest);
};

export const honoLoggerMiddleware = honoLogger(customLogger);
