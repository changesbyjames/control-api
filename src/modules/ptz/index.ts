import { Hono } from "hono";

import * as constants from "@/constants";
import { RegisterRoute, serveHandler, type Module } from "@/modules/module";
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

		PTZModule.use(...CameraMiddleware);

		RegisterRoute(
			PTZModule,
			"POST",
			"/load",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(PTZHandler),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/move",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(MoveHandler),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/pan",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(PanHandler),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/tilt",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(TiltHandler),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/zoom",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(ZoomHandler),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/areazoom",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(AreazoomHandler),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/spin",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(SpinHandler),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"rptz",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(RPTZHandler),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/rpan",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(RPanHandler),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/rtilt",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(RTiltHandler),
		);

		RegisterRoute(
			PTZModule,
			"POST",
			"/rzoom",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(RZoomHandler),
		);

		return PTZModule;
	},
	Shutdown: (): void => {},
};

export default PTZModule;
