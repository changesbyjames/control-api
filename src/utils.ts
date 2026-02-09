import type { Context } from "hono";
import { type StatusCode } from "hono/utils/http-status";
import * as z from "zod";

import * as constants from "@/constants";

interface APIError {
	code: number;
	details: string;
}

export const PositionValueSchema = z.union([z.number(), z.string()]);
export const PositionMapSchema = z.record(z.string(), PositionValueSchema);
export type PositionMap = z.infer<typeof PositionMapSchema>;

export function APIErrorResponse(
	ctx: Context<constants.Env>,
	status: number,
	code: number,
	error: unknown,
): Response {
	let err = error instanceof Error ? error : new Error(String(error));

	let details = err.message;
	if (err.cause) {
		details += `: ${err.cause}`;
	}

	let newAPIError: APIError = {
		code: code,
		details: details,
	};

	ctx.status(status as StatusCode);

	return ctx.json(newAPIError);
}

export function formatPosition(position: string): PositionMap {
	const parsed: PositionMap = {};

	position.split("\r\n").forEach((entry) => {
		const [key, ...rest] = entry.split("=");
		if (key === "" || rest.length === 0) {
			return;
		}

		const value = rest.join("=").trim();
		const maybeNumber = Number(value);
		parsed[key] = Number.isNaN(maybeNumber) ? value : maybeNumber;
	});

	return PositionMapSchema.parse(parsed);
}

export function mapTopicToFriendlyName(topic: string): string | undefined {
	for (const [key, value] of constants.topicMap) {
		if (topic.startsWith(key)) {
			return value;
		}
	}
	return undefined;
}
