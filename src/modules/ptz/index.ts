import { Hono } from "hono";

import * as constants from "@/constants";
import type { Module } from "@/modules/module";
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
			"/",
			CapabilitiesMiddleware("PTZ"),
			...PTZHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/load",
			CapabilitiesMiddleware("PTZ"),
			...PTZHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/move",
			CapabilitiesMiddleware("PTZ"),
			...MoveHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/pan",
			CapabilitiesMiddleware("PTZ"),
			...PanHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/tilt",
			CapabilitiesMiddleware("PTZ"),
			...TiltHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/zoom",
			CapabilitiesMiddleware("PTZ"),
			...ZoomHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/areazoom",
			CapabilitiesMiddleware("PTZ"),
			...AreazoomHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/spin",
			CapabilitiesMiddleware("PTZ"),
			...SpinHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"rptz",
			CapabilitiesMiddleware("PTZ"),
			...RPTZHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/rpan",
			CapabilitiesMiddleware("PTZ"),
			...RPanHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/rtilt",
			CapabilitiesMiddleware("PTZ"),
			...RTiltHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/rzoom",
			CapabilitiesMiddleware("PTZ"),
			...RZoomHandler.handle(),
		);

		return [authenticatedRoute, unauthenticatedRoute];
	},
	Shutdown: (): void => {},
};

export default PTZModule;
