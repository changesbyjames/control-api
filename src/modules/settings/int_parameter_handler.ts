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
function newParameterAdapter(max: number) {
	return z.object({
		value: z.number().min(0).and(z.number().max(max)),
	});
}

const SetIntParameterHandler: Handler = {
	openapi: describeRoute({
		summary: "Set Integer Parameter",
		tags: ["Settings"],
		description: "Set an integer camera parameter",
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
	handle: (parameter: string, max: number) => {
		const valueAdapter = newParameterAdapter(max);

		return createFactory<constants.Env>().createHandlers(
			validator("json", valueAdapter),
			async (ctx) => {
				const value = ctx.req.valid("json");

				let camera = ctx.get(constants.targetCameraKey);
				if (!camera) {
					return APIErrorResponse(
						ctx,
						http.HTTP_STATUS_INTERNAL_SERVER_ERROR,
						ErrorCode.InvalidContextCode,
						errors.ErrCameraNotSet,
					);
				}

				return VAPIXManager.SetParameter(ctx, camera, parameter, value.value);
			},
		);
	},
};

export default SetIntParameterHandler;
