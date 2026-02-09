import { Hono } from "hono";

import * as constants from "@/constants";
import { serveHandler, type Module } from "@/modules/module";
import { CameraMiddleware, CapabilitiesMiddleware } from "@/server/middleware";

import GetInfoHandler from "./get_info_handler";
import GetSpeedHandler from "./get_speed_handler";
import GetScreenshotHandler from "./get_screenshot_handler";

const InfoModule: Module = {
	name: "Info",
	basePath: "/info",
	Initialize: (config): Hono<{ Variables: constants.Variables }> => {
		const infoModule = new Hono<{ Variables: constants.Variables }>();

		infoModule.use(...CameraMiddleware);

		infoModule.on(
			"GET",
			"/position",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(GetInfoHandler),
		);

		infoModule.on(
			"GET",
			"/speed",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(GetSpeedHandler),
		);

		infoModule.on(
			"GET",
			"/screenshot",
			CapabilitiesMiddleware("Screenshots"),
			...serveHandler(GetScreenshotHandler),
		);

		return infoModule;
	},
	Shutdown: (): void => {},
};

export default InfoModule;
