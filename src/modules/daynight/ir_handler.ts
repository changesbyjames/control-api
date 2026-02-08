import { createFactory } from "hono/factory";
import * as z from "zod";
import { constants as http } from "http2";

import * as constants from "@/constants";
import { VAPIXManager } from "@/managers";
import { type Handler } from "@/modules/module";
import { APIErrorResponse } from "@/utils";
import { ErrorCode } from "@/errors/error_codes";
import * as errors from "@/errors/errors";

const IrAdapter = z.object({
	light: z
		.string()
		.regex(/^led\d$/, { message: "Must be 'led' followed by a number" }),
	state: z.enum(["on", "off", "auto"]),
});

const IrHandler: Handler = {
	adapter: IrAdapter,
	handle: () => {
		return createFactory<constants.Env>().createHandlers(async (ctx) => {
			let ir;
			try {
				ir = IrAdapter.parse(await ctx.req.json());
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

			let irFilter: string;
			switch (ir.state) {
				case "on":
					irFilter = "off";
					break;
				case "off":
					irFilter = "on";
					break;
				case "auto":
					irFilter = "auto";
					break;
			}

			let url = VAPIXManager.URLBuilder(camera.host, "com/ptz", {
				ircutfilter: irFilter,
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

			url = VAPIXManager.URLBuilder(camera.host, "lightcontrol");
			let data = {
				apiVersion: "1.0",
				context: "light",
				method:
					ir.state == "on" || ir.state == "auto"
						? "enableLight"
						: "disableLight",
				params: {
					lightID: ir.light,
				},
			};

			try {
				response = await VAPIXManager.makeAPICall(
					camera.client,
					url,
					"POST",
					data,
				);
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

export default IrHandler;
