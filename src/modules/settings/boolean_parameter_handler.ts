import { createFactory } from "hono/factory";
import * as z from "zod";
import { constants as http } from "http2";

import * as constants from "@/constants";
import { VAPIXManager } from "@/managers";
import { type Handler } from "@/modules/module";
import { APIErrorResponse } from "@/utils";
import { ErrorCode } from "@/errors/error_codes";
import * as errors from "@/errors/errors";
import { describeRoute, resolver, validator } from "hono-openapi";

// prettier-ignore
const parameterAdapter = z.object({
	enabled: z.boolean(),
});

export const SetParameterHandler: Handler = {
	openapi: describeRoute({
		tags: ["Settings"],
		description: "Set a boolean camera parameter",
		responses: {
			200: {
				description: "Parameter state",
				content: {
					"application/json": {
						schema: resolver(z.record(z.string(), z.any())),
					},
				},
			},
		},
	}),
	handle: (parameter: string) => {
		return createFactory<constants.Env>().createHandlers(
			validator("json", parameterAdapter),
			async (ctx) => {
				const enabled = ctx.req.valid("json");

				let camera = ctx.get(constants.targetCameraKey);
				if (!camera) {
					return APIErrorResponse(
						ctx,
						http.HTTP_STATUS_INTERNAL_SERVER_ERROR,
						ErrorCode.InvalidContextCode,
						errors.ErrCameraNotSet,
					);
				}

				return VAPIXManager.SetParameter(
					ctx,
					camera,
					parameter,
					enabled.enabled,
				);
			},
		);
	},
};

export const GetParameterHandler: Handler = {
	openapi: describeRoute({
		tags: ["Settings"],
		description: "Get a camera parameter",
		responses: {
			200: {
				description: "Parameter state",
				content: {
					"application/json": {
						schema: resolver(z.record(z.string(), z.any())),
					},
				},
			},
		},
	}),
	handle: (parameter: string) => {
		return createFactory<constants.Env>().createHandlers(async (ctx) => {
			let camera = ctx.get(constants.targetCameraKey);
			if (!camera) {
				return APIErrorResponse(
					ctx,
					http.HTTP_STATUS_INTERNAL_SERVER_ERROR,
					ErrorCode.InvalidContextCode,
					errors.ErrCameraNotSet,
				);
			}

			return VAPIXManager.GetParameter(ctx, camera, parameter);
		});
	},
};
