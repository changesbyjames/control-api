import { Hono } from "hono";

import * as constants from "@/constants";
import { RegisterRoute, type Module } from "@/modules/module";
import { CameraMiddleware, CapabilitiesMiddleware } from "@/server/middleware";

import IrFilterHandler from "./ir_filter_handler";
import IrLightHandler from "./ir_light_handler";
import IrHandler from "./ir_handler";

const DayNightModule: Module = {
	name: "DayNight",
	basePath: "/ir",
	Initialize: (config): Hono<{ Variables: constants.Variables }> => {
		const DayNightModule = new Hono<{ Variables: constants.Variables }>();

		DayNightModule.use(CameraMiddleware);

		RegisterRoute(
			DayNightModule,
			"POST",
			"/",
			CapabilitiesMiddleware("IrCutFilter", "IrLight"),
			...IrHandler.handle(),
		);

		RegisterRoute(
			DayNightModule,
			"POST",
			"/filter",
			CapabilitiesMiddleware("IrCutFilter"),
			...IrFilterHandler.handle(),
		);

		RegisterRoute(
			DayNightModule,
			"POST",
			"/light",
			CapabilitiesMiddleware("IrLight"),
			...IrLightHandler.handle(),
		);

		return DayNightModule;
	},
	Shutdown: (): void => {},
};

export default DayNightModule;
