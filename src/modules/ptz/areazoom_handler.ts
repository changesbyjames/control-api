import { createFactory } from "hono/factory";
import * as z from "zod";
import { constants as http } from "http2";

import * as constants from "@/constants";
import { VAPIXManager } from "@/managers";
import { type Handler } from "@/modules/module";
import { APIErrorResponse } from "@/utils";
import { ErrorCode } from "@/errors/error_codes";
import * as errors from "@/errors/errors";

// prettier-ignore
const areazoomAdapter = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number().min(1),
});

const AreazoomHandler: Handler = {
	adapter: areazoomAdapter,
	handle: () => {
		return createFactory<constants.Env>().createHandlers(async (ctx) => {
			let areazoom;
			try {
				areazoom = areazoomAdapter.parse(await ctx.req.json());
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

			let coordinates = [areazoom.x, areazoom.y, areazoom.z].join(",");

			let url = VAPIXManager.URLBuilder(camera.host, "com/ptz", {
				areazoom: coordinates,
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
		});
	},
};

export default AreazoomHandler;
