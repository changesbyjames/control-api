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
		const authenticatedRoutes = new Hono<{ Variables: constants.Variables }>();
		const unauthenticatedRoutes = new Hono<{
			Variables: constants.Variables;
		}>();

		authenticatedRoutes.use(CameraMiddleware);

		authenticatedRoutes.on(
			"GET",
			"/position",
			CapabilitiesMiddleware("PTZ"),
			...GetInfoHandler.handle(),
		);

		authenticatedRoutes.on(
			"GET",
			"/speed",
			CapabilitiesMiddleware("PTZ"),
			...GetSpeedHandler.handle(),
		);

		authenticatedRoutes.on(
			"GET",
			"/screenshot",
			CapabilitiesMiddleware("Screenshots"),
			...GetScreenshotHandler.handle(),
		);

		return [authenticatedRoutes, unauthenticatedRoutes];
	},
	Shutdown: (): void => {},
};

export default InfoModule;
