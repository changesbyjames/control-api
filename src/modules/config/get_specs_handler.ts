import { createFactory } from "hono/factory";
import * as z from "zod";
import { constants as http } from "http2";

import * as constants from "@/constants";
import { CameraManager } from "@/managers";
import { type Handler } from "@/modules/module";
import { APIErrorResponse } from "@/utils";
import { ErrorCode } from "@/errors/error_codes";
import { describeRoute, resolver, validator } from "hono-openapi";

const GetSpecsHandler: Handler = {
	openapi: describeRoute({
		summary: "Get Specs",
		tags: ["Config"],
		description: "Get specifications for a specific camera",
		responses: {
			200: {
				description: "Camera specs",
				content: {
					"application/json": {
						schema: resolver(
							z.object({
								camera: z.string(),
								specs: z.object(),
							}),
						),
					},
				},
			},
		},
	}),
	handle: () => {
		return createFactory<constants.Env>().createHandlers(
			validator(
				"param",
				z.object({
					camera: z.string().min(1),
				}),
			),
			async (ctx) => {
				const { camera: cameraName } = ctx.req.valid("param");

				const camera = CameraManager.getCamera(cameraName);
				if (!camera) {
					return APIErrorResponse(
						ctx,
						http.HTTP_STATUS_BAD_REQUEST,
						ErrorCode.UnknownCameraCode,
						new Error(`No camera matching ${cameraName} found`),
					);
				}

				return ctx.json({
					camera: camera.name,
					specs: camera.specs,
				});
			},
		);
	},
};

export default GetSpecsHandler;
