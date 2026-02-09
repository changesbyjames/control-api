import { Hono } from "hono";

import * as constants from "@/constants";
import { serveHandler, type Module } from "@/modules/module";
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
		const ptzModule = new Hono<{ Variables: constants.Variables }>();

		ptzModule.use(...CameraMiddleware);

		ptzModule.on(
			"POST",
			"/",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(PTZHandler),
		);

		ptzModule.on(
			"POST",
			"/load",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(PTZHandler),
		);

		ptzModule.on(
			"POST",
			"/move",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(MoveHandler),
		);

		ptzModule.on(
			"POST",
			"/pan",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(PanHandler),
		);

		ptzModule.on(
			"POST",
			"/tilt",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(TiltHandler),
		);

		ptzModule.on(
			"POST",
			"/zoom",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(ZoomHandler),
		);

		ptzModule.on(
			"POST",
			"/areazoom",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(AreazoomHandler),
		);

		ptzModule.on(
			"POST",
			"/spin",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(SpinHandler),
		);

		ptzModule.on(
			"POST",
			"rptz",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(RPTZHandler),
		);

		ptzModule.on(
			"POST",
			"/rpan",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(RPanHandler),
		);

		ptzModule.on(
			"POST",
			"/rtilt",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(RTiltHandler),
		);

		ptzModule.on(
			"POST",
			"/rzoom",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(RZoomHandler),
		);

		return ptzModule;
	},
	Shutdown: (): void => {},
};

export default PTZModule;
