import { createFactory } from "hono/factory";
import * as z from "zod";
import { constants as http } from "http2";

import * as constants from "@/constants";
import { VAPIXManager } from "@/managers";
import { type Handler } from "@/modules/module";
import { APIErrorResponse } from "@/utils";
import { ErrorCode } from "@/errors/error_codes";
import * as errors from "@/errors/errors";

const autoirisAdapter = z.object({
	state: z.enum(["on", "off"]),
});

const AutoirisHandler: Handler = {
	adapter: autoirisAdapter,
	handle: () => {
		return createFactory<constants.Env>().createHandlers(async (ctx) => {
			let autoiris;
			try {
				autoiris = autoirisAdapter.parse(await ctx.req.json());
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
				autoiris: autoiris.state,
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

export default AutoirisHandler;
