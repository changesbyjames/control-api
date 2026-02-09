import { createFactory } from "hono/factory";
import { constants as http } from "http2";

import * as constants from "@/constants";
import { VAPIXManager } from "@/managers";
import { type Handler } from "@/modules/module";
import { APIErrorResponse, formatPosition, PositionMapSchema } from "@/utils";
import { ErrorCode } from "@/errors/error_codes";
import * as errors from "@/errors/errors";
import { describeRoute, resolver } from "hono-openapi";

const GetSpeedHandler: Handler = {
	openapi: describeRoute({
		description: "Get the speed of the camera",
		responses: {
			200: {
				description: "Speed of the camera",
				content: {
					"application/json": {
						schema: resolver(PositionMapSchema),
					},
				},
			},
		},
	}),
	handle: () => {
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

			let url = VAPIXManager.URLBuilder(camera.host, "com/ptz", {
				query: "speed",
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
		});
	},
};

export default GetSpeedHandler;
