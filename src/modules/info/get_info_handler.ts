import { createFactory } from "hono/factory";
import { constants as http } from "http2";

import * as constants from "@/constants";
import { VAPIXManager } from "@/managers";
import { type Handler } from "@/modules/module";
import { APIErrorResponse, formatPosition } from "@/utils";
import { ErrorCode } from "@/errors/error_codes";
import * as errors from "@/errors/errors";

import { z } from "zod";
import { describeRoute, resolver, validator } from "hono-openapi";

const description = describeRoute({
	description: "Say hello to the user",
	responses: {
		200: {
			description: "Successful response",
			content: {
				"application/json": {
					schema: resolver(z.object({ message: z.string() })),
				},
			},
		},
	},
});

const adapter = validator("json", z.object({ name: z.string() }));

const GetInfoHandler: Handler = {
	handle: () => {
		return createFactory<constants.Env>().createHandlers(
			description,
			adapter,
			async (ctx) => {
				let camera = ctx.get(constants.targetCameraKey);
				if (!camera) {
					return APIErrorResponse(
						ctx,
						http.HTTP_STATUS_INTERNAL_SERVER_ERROR,
						ErrorCode.InvalidContextCode,
						errors.ErrCameraNotSet,
					);
				}

				let url = VAPIXManager.URLBuilder(camera.host, "com/ptz", {
					query: "position",
				});

				let response;
				try {
					response = await VAPIXManager.makeAPICall(camera.client, url);
				} catch (error) {
					return APIErrorResponse(
						ctx,
						http.HTTP_STATUS_INTERNAL_SERVER_ERROR,
						ErrorCode.VAPIXCallFailed,
						errors.ErrUnableToCallVAPIX(error),
					);
				}

				if (!response.ok) {
					return APIErrorResponse(
						ctx,
						http.HTTP_STATUS_BAD_GATEWAY,
						ErrorCode.VAPIXCallFailed,
						errors.ErrVAPIXCallFailed(await response.text()),
					);
				}

				let values = await response.text();
				return ctx.json(formatPosition(values));
			},
		);
	},
};

export default GetInfoHandler;
