import { createFactory } from "hono/factory";
import { constants as http } from "http2";

import * as constants from "@/constants";
import { VAPIXManager } from "@/managers";
import { type Handler } from "@/modules/module";
import { APIErrorResponse, formatPosition } from "@/utils";
import { ErrorCode } from "@/errors/error_codes";
import * as errors from "@/errors/errors";

const GetInfoHandler: Handler = {
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

			let url = VAPIXManager.URLBuilder("com/ptz", camera.host, {
				query: "position",
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

			let values = await response.text();
			return ctx.json(formatPosition(values));
		});
	},
};

export default GetInfoHandler;
