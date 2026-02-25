import type { Context } from "hono";
import { type StatusCode } from "hono/utils/http-status";
import * as z from "zod";
import _ from "lodash";

import * as constants from "@/constants";
import type { Camera } from "./models";

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

export function formatQueryResponse(position: string): Record<string, any> {
	let o: any = {};
	position
		.replaceAll("\r", "")
		.split("\n")
		.forEach((p) => {
			let j = p.split("=");
			if (j[0] != "") {
				let v = j[1].trim();
				o[j[0].trim().replaceAll(" ", "_")] = !Number.isNaN(Number(v))
					? Number(v)
					: v;
			}
		});

	return o;
}

export function formatPosition(position: string): PositionMap {
	return PositionMapSchema.parse(formatQueryResponse(position));
}

export function mapTopicToFriendlyName(topic: string): string | undefined {
	for (const [key, value] of constants.topicMap) {
		if (topic.startsWith(key)) {
			return value;
		}
	}
	return undefined;
}

export function calculateHFOV(zoom: number, camera: Camera) {
	zoom = Math.min(zoom, 9999);
	let focalLength =
		camera.specs.focalLength.min +
		((camera.specs.focalLength.max - camera.specs.focalLength.min) *
			(zoom - 1)) /
			9998;

	return _.round(
		2 *
			Math.atan(camera.specs.sensorWidth / (2 * focalLength)) *
			(180 / Math.PI),
		3,
	);
}

export function calculateVFOV(zoom: number, camera: Camera) {
	zoom = Math.min(zoom, 9999);
	let focalLength =
		camera.specs.focalLength.min +
		((camera.specs.focalLength.max - camera.specs.focalLength.min) *
			(zoom - 1)) /
			9998;

	return _.round(
		2 *
			Math.atan(camera.specs.sensorHeight / (2 * focalLength)) *
			(180 / Math.PI),
		3,
	);
}
