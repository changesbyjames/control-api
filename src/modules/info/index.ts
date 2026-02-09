import { Hono } from "hono";

import * as constants from "@/constants";
import type { Module } from "@/modules/module";
import { CameraMiddleware, CapabilitiesMiddleware } from "@/server/middleware";

import GetInfoHandler from "./get_info_handler";
import GetSpeedHandler from "./get_speed_handler";
import GetScreenshotHandler from "./get_screenshot_handler";

const InfoModule: Module = {
	name: "Info",
	basePath: "/info",
	Initialize: (
		config,
	): [
		Hono<{ Variables: constants.Variables }>,
		Hono<{ Variables: constants.Variables }>,
	] => {
		const authenticatedRoute = new Hono<{ Variables: constants.Variables }>();
		const unauthenticatedRoute = new Hono<{
			Variables: constants.Variables;
		}>();

		authenticatedRoute.use(CameraMiddleware);

		authenticatedRoute.on(
			"GET",
			"/position",
			CapabilitiesMiddleware("PTZ"),
			...GetInfoHandler.handle(),
		);

		authenticatedRoute.on(
			"GET",
			"/speed",
			CapabilitiesMiddleware("PTZ"),
			...GetSpeedHandler.handle(),
		);

		authenticatedRoute.on(
			"GET",
			"/screenshot",
			CapabilitiesMiddleware("Screenshots"),
			...GetScreenshotHandler.handle(),
		);

		return [authenticatedRoute, unauthenticatedRoute];
	},
	Shutdown: (): void => {},
};

export default InfoModule;
