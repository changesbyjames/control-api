import { createFactory } from "hono/factory";
import * as z from "zod";
import { constants as http } from "http2";

import * as constants from "@/constants";
import { VAPIXManager } from "@/managers";
import { type Handler } from "@/modules/module";
import { APIErrorResponse } from "@/utils";
import { ErrorCode } from "@/errors/error_codes";
import * as errors from "@/errors/errors";

const rptzAdapter = z
	.object({
		pan: z.number().min(-360.0).and(z.number().max(360.0)).optional(),
		tilt: z.number().min(-360.0).and(z.number().max(360.0)).optional(),
		zoom: z.number().min(-19999).and(z.number().max(19999)).optional(),
	})
	.refine(
		(data) =>
			data.pan !== undefined ||
			data.tilt !== undefined ||
			data.zoom !== undefined,
		{
			message: "At least one of pan, tilt, or zoom must be provided",
		},
	);

const RPTZHandler: Handler = {
	adapter: rptzAdapter,
	handle: () => {
		return createFactory<constants.Env>().createHandlers(async (ctx) => {
			let rptz;
			try {
				rptz = rptzAdapter.parse(await ctx.req.json());
			} catch (error) {
				return APIErrorResponse(
					ctx,
					http.HTTP_STATUS_BAD_REQUEST,
					ErrorCode.InvalidRequestBodyCode,
					error,
				);
			}

			let camera = ctx.get(constants.targetCameraKey);
			if (!camera) {
				return APIErrorResponse(
					ctx,
					http.HTTP_STATUS_INTERNAL_SERVER_ERROR,
					ErrorCode.InvalidContextCode,
					errors.ErrCameraNotSet,
				);
			}

			let url = VAPIXManager.URLBuilder("com/ptz", camera.host, {
				...(rptz.pan !== undefined && { pan: rptz.pan }),
				...(rptz.tilt !== undefined && { tilt: rptz.tilt }),
				...(rptz.zoom !== undefined && { zoom: rptz.zoom }),
			});

			let response;
			try {
				response = await VAPIXManager.makeAPICall(url, camera.client);
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
		});
	},
};

export default RPTZHandler;
