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
		const authenticatedRoutes = new Hono<{ Variables: constants.Variables }>();
		const unauthenticatedRoutes = new Hono<{
			Variables: constants.Variables;
		}>();

		authenticatedRoutes.use(CameraMiddleware);

		authenticatedRoutes.on(
			"POST",
			"/",
			CapabilitiesMiddleware("PTZ"),
			...PTZHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/load",
			CapabilitiesMiddleware("PTZ"),
			...PTZHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/move",
			CapabilitiesMiddleware("PTZ"),
			...MoveHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/pan",
			CapabilitiesMiddleware("PTZ"),
			...PanHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/tilt",
			CapabilitiesMiddleware("PTZ"),
			...TiltHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/zoom",
			CapabilitiesMiddleware("PTZ"),
			...ZoomHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/areazoom",
			CapabilitiesMiddleware("PTZ"),
			...AreazoomHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/spin",
			CapabilitiesMiddleware("PTZ"),
			...SpinHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"rptz",
			CapabilitiesMiddleware("PTZ"),
			...RPTZHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/rpan",
			CapabilitiesMiddleware("PTZ"),
			...RPanHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/rtilt",
			CapabilitiesMiddleware("PTZ"),
			...RTiltHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/rzoom",
			CapabilitiesMiddleware("PTZ"),
			...RZoomHandler.handle(),
		);

		return [authenticatedRoutes, unauthenticatedRoutes];
	},
	Shutdown: (): void => {},
};

export default PTZModule;
