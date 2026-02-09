import { Hono } from "hono";

import * as constants from "@/constants";
import type { Module } from "@/modules/module";
import { CameraMiddleware, CapabilitiesMiddleware } from "@/server/middleware";

import IrFilterHandler from "./ir_filter_handler";
import IrLightHandler from "./ir_light_handler";
import IrHandler from "./ir_handler";

const DayNightModule: Module = {
	name: "DayNight",
	basePath: "/ir",
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
			"POST",
			"",
			CapabilitiesMiddleware("IrCutFilter", "IrLight"),
			...IrHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/filter",
			CapabilitiesMiddleware("IrCutFilter"),
			...IrFilterHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/light",
			CapabilitiesMiddleware("IrLight"),
			...IrLightHandler.handle(),
		);

		return [authenticatedRoute, unauthenticatedRoute];
	},
	Shutdown: (): void => {},
};

export default DayNightModule;
