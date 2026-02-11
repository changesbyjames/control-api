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

const rfocusAdapter = z.object({
	value: z.number().min(-9999).and(z.number().max(9999)),
});

const RFocusHandler: Handler = {
	openapi: describeRoute({
		summary: "Relative Focus",
		tags: ["Imaging"],
		description: "Set relative focus movement",
		responses: {
			200: {
				description: "Successfully submitted to the camera",
				content: {
					"text/plain": {
						schema: resolver(z.string()),
					},
				},
			},
		},
	}),
	handle: () => {
		return createFactory<constants.Env>().createHandlers(
			validator("json", rfocusAdapter),
			async (ctx) => {
				const rfocus = ctx.req.valid("json");

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
					rfocus: rfocus.value,
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

				return ctx.text(await response.text());
			},
		);
	},
};

export default RFocusHandler;
