import { Hono } from "hono";

import * as constants from "@/constants";
import { RegisterRoute, serveHandler, type Module } from "@/modules/module";
import { CameraMiddleware, CapabilitiesMiddleware } from "@/server/middleware";

import GetInfoHandler from "./get_info_handler";
import GetSpeedHandler from "./get_speed_handler";
import GetScreenshotHandler from "./get_screenshot_handler";
import GetResolutionHandler from "./get_resolution_handler";

const InfoModule: Module = {
	name: "Info",
	basePath: "/info",
	Initialize: (config): Hono<{ Variables: constants.Variables }> => {
		const InfoModule = new Hono<{ Variables: constants.Variables }>();

		InfoModule.use(...CameraMiddleware);

		RegisterRoute(
			InfoModule,
			"GET",
			"/position",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(GetInfoHandler),
		);

		RegisterRoute(
			InfoModule,
			"GET",
			"/speed",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(GetSpeedHandler),
		);

		RegisterRoute(
			InfoModule,
			"GET",
			"/screenshot",
			CapabilitiesMiddleware("Screenshots"),
			...serveHandler(GetScreenshotHandler),
		);

		RegisterRoute(
			InfoModule,
			"GET",
			"/resolution",
			...serveHandler(GetResolutionHandler),
		);

		return InfoModule;
	},
	Shutdown: (): void => {},
};

export default InfoModule;
