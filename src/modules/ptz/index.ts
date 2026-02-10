import { Hono } from "hono";

import * as constants from "@/constants";
import { RegisterRoute, type Module } from "@/modules/module";
import { CameraMiddleware, CapabilitiesMiddleware } from "@/server/middleware";

import PTZHandler from "./ptz_handler";
import MoveHandler from "./move_handler";
import PanHandler from "./pan_handler";
import TiltHandler from "./tilt_handler";
import ZoomHandler from "./zoom_handler";
import AreazoomHandler from "./areazoom_handler";
import SpinHandler from "./spin_handler";
import RPTZHandler from "./relative_ptz_handler";
import RPanHandler from "./relative_pan_handler";
import RTiltHandler from "./relative_tilt_handler";
import RZoomHandler from "./relative_zoom_handler";

const PTZModule: Module = {
	name: "PTZ",
	basePath: "/ptz",
	Initialize: (config): Hono<{ Variables: constants.Variables }> => {
		const PTZModule = new Hono<{ Variables: constants.Variables }>();

		PTZModule.use(CameraMiddleware);

		RegisterRoute(
			PTZModule,
			"POST",
			"/",
			CapabilitiesMiddleware("PTZ"),
			...PTZHandler.handle(),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/load",
			CapabilitiesMiddleware("PTZ"),
			...PTZHandler.handle(),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/",
			CapabilitiesMiddleware("PTZ"),
			...MoveHandler.handle(),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/move",
			CapabilitiesMiddleware("PTZ"),
			...MoveHandler.handle(),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/pan",
			CapabilitiesMiddleware("PTZ"),
			...PanHandler.handle(),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/tilt",
			CapabilitiesMiddleware("PTZ"),
			...TiltHandler.handle(),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/zoom",
			CapabilitiesMiddleware("PTZ"),
			...ZoomHandler.handle(),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/areazoom",
			CapabilitiesMiddleware("PTZ"),
			...AreazoomHandler.handle(),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/spin",
			CapabilitiesMiddleware("PTZ"),
			...SpinHandler.handle(),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"rptz",
			CapabilitiesMiddleware("PTZ"),
			...RPTZHandler.handle(),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/rpan",
			CapabilitiesMiddleware("PTZ"),
			...RPanHandler.handle(),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/rtilt",
			CapabilitiesMiddleware("PTZ"),
			...RTiltHandler.handle(),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/rzoom",
			CapabilitiesMiddleware("PTZ"),
			...RZoomHandler.handle(),
		);

		return PTZModule;
	},
	Shutdown: (): void => {},
};

export default PTZModule;
