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
		const authenticatedRoutes = new Hono<{ Variables: constants.Variables }>();
		const unauthenticatedRoutes = new Hono<{
			Variables: constants.Variables;
		}>();

		authenticatedRoutes.use(CameraMiddleware);

		authenticatedRoutes.on(
			"POST",
			"",
			CapabilitiesMiddleware("IrCutFilter", "IrLight"),
			...IrHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/filter",
			CapabilitiesMiddleware("IrCutFilter"),
			...IrFilterHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/light",
			CapabilitiesMiddleware("IrLight"),
			...IrLightHandler.handle(),
		);

		return [authenticatedRoutes, unauthenticatedRoutes];
	},
	Shutdown: (): void => {},
};

export default DayNightModule;
