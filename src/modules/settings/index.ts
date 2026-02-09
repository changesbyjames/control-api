import { Hono } from "hono";

import * as constants from "@/constants";
import type { Module } from "@/modules/module";
import { CameraMiddleware, CapabilitiesMiddleware } from "@/server/middleware";

import {
	GetParameterHandler,
	SetParameterHandler,
} from "./boolean_parameter_handler";
import SetSpeedHandler from "./set_speed_handler";
import GetSpeedHandler from "@/modules/info/get_speed_handler";
import SetIntParameterHandler from "./int_parameter_handler";

const SettingsModule: Module = {
	name: "Settings",
	basePath: "/settings",
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
			"/quickzoom",
			CapabilitiesMiddleware("PTZ", "QuickZoom"),
			...GetParameterHandler.handle("PTZ.UserAdv.U1.QuickZoom"),
		);

		authenticatedRoute.on(
			"POST",
			"/quickzoom",
			CapabilitiesMiddleware("PTZ", "QuickZoom"),
			...SetParameterHandler.handle("PTZ.UserAdv.U1.QuickZoom"),
		);

		authenticatedRoute.on(
			"GET",
			"/spotfocus",
			CapabilitiesMiddleware("SpotFocus"),
			...GetParameterHandler.handle("PTZ.UserAdv.U1.SpotFocus"),
		);

		authenticatedRoute.on(
			"POST",
			"/spotfocus",
			CapabilitiesMiddleware("SpotFocus"),
			...SetParameterHandler.handle("PTZ.UserAdv.U1.SpotFocus"),
		);

		authenticatedRoute.on(
			"POST",
			"/saturation",
			CapabilitiesMiddleware("Appearance"),
			...SetIntParameterHandler.handle("ImageSource.I0.Sensor.ColorLevel", 100),
		);

		authenticatedRoute.on(
			"GET",
			"/saturation",
			CapabilitiesMiddleware("Appearance"),
			...GetParameterHandler.handle("ImageSource.I0.Sensor.ColorLevel"),
		);

		authenticatedRoute.on(
			"POST",
			"/brightness",
			CapabilitiesMiddleware("Appearance"),
			...SetIntParameterHandler.handle("ImageSource.I0.Sensor.Brightness", 100),
		);

		authenticatedRoute.on(
			"GET",
			"/brightness",
			CapabilitiesMiddleware("Appearance"),
			...GetParameterHandler.handle("ImageSource.I0.Sensor.Brightness"),
		);

		authenticatedRoute.on(
			"POST",
			"/contrast",
			CapabilitiesMiddleware("Appearance"),
			...SetIntParameterHandler.handle("ImageSource.I0.Sensor.Contrast", 100),
		);

		authenticatedRoute.on(
			"GET",
			"/contrast",
			CapabilitiesMiddleware("Appearance"),
			...GetParameterHandler.handle("ImageSource.I0.Sensor.Contrast"),
		);

		authenticatedRoute.on(
			"POST",
			"/sharpness",
			CapabilitiesMiddleware("Appearance"),
			...SetIntParameterHandler.handle("ImageSource.I0.Sensor.Sharpness", 100),
		);

		authenticatedRoute.on(
			"GET",
			"/sharpness",
			CapabilitiesMiddleware("Appearance"),
			...GetParameterHandler.handle("ImageSource.I0.Sensor.Sharpness"),
		);

		authenticatedRoute.on(
			"POST",
			"/localcontrast",
			CapabilitiesMiddleware("WideDynamicRange"),
			...SetIntParameterHandler.handle(
				"ImageSource.I0.Sensor.LocalContrast",
				100,
			),
		);

		authenticatedRoute.on(
			"GET",
			"/localcontrast",
			CapabilitiesMiddleware("WideDynamicRange"),
			...GetParameterHandler.handle("ImageSource.I0.Sensor.LocalContrast"),
		);

		authenticatedRoute.on(
			"POST",
			"/tonemapping",
			CapabilitiesMiddleware("WideDynamicRange"),
			...SetIntParameterHandler.handle(
				"ImageSource.I0.Sensor.ToneMapping",
				100,
			),
		);

		authenticatedRoute.on(
			"GET",
			"/tonemapping",
			CapabilitiesMiddleware("WideDynamicRange"),
			...GetParameterHandler.handle("ImageSource.I0.Sensor.ToneMapping"),
		);

		authenticatedRoute.on(
			"POST",
			"/proportionalspeed",
			CapabilitiesMiddleware("PTZ"),
			...SetIntParameterHandler.handle(
				"PTZ.Various.V1.MaxProportionalSpeed",
				1000,
			),
		);

		authenticatedRoute.on(
			"GET",
			"/proportionalspeed",
			CapabilitiesMiddleware("PTZ"),
			...GetParameterHandler.handle("PTZ.Various.V1.MaxProportionalSpeed"),
		);

		// This is identical to info/speed, I just couldn't decide where to put it
		authenticatedRoute.on(
			"GET",
			"/speed",
			CapabilitiesMiddleware("PTZ"),
			...GetSpeedHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/speed",
			CapabilitiesMiddleware("PTZ"),
			...SetSpeedHandler.handle(),
		);

		return [authenticatedRoute, unauthenticatedRoute];
	},
	Shutdown: (): void => {},
};

export default SettingsModule;
