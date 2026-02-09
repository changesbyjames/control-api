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
		const authenticatedRoutes = new Hono<{ Variables: constants.Variables }>();
		const unauthenticatedRoutes = new Hono<{
			Variables: constants.Variables;
		}>();

		authenticatedRoutes.use(CameraMiddleware);

		authenticatedRoutes.on(
			"GET",
			"/quickzoom",
			CapabilitiesMiddleware("PTZ", "QuickZoom"),
			...GetParameterHandler.handle("PTZ.UserAdv.U1.QuickZoom"),
		);

		authenticatedRoutes.on(
			"POST",
			"/quickzoom",
			CapabilitiesMiddleware("PTZ", "QuickZoom"),
			...SetParameterHandler.handle("PTZ.UserAdv.U1.QuickZoom"),
		);

		authenticatedRoutes.on(
			"GET",
			"/spotfocus",
			CapabilitiesMiddleware("SpotFocus"),
			...GetParameterHandler.handle("PTZ.UserAdv.U1.SpotFocus"),
		);

		authenticatedRoutes.on(
			"POST",
			"/spotfocus",
			CapabilitiesMiddleware("SpotFocus"),
			...SetParameterHandler.handle("PTZ.UserAdv.U1.SpotFocus"),
		);

		authenticatedRoutes.on(
			"POST",
			"/saturation",
			CapabilitiesMiddleware("Appearance"),
			...SetIntParameterHandler.handle("ImageSource.I0.Sensor.ColorLevel", 100),
		);

		authenticatedRoutes.on(
			"GET",
			"/saturation",
			CapabilitiesMiddleware("Appearance"),
			...GetParameterHandler.handle("ImageSource.I0.Sensor.ColorLevel"),
		);

		authenticatedRoutes.on(
			"POST",
			"/brightness",
			CapabilitiesMiddleware("Appearance"),
			...SetIntParameterHandler.handle("ImageSource.I0.Sensor.Brightness", 100),
		);

		authenticatedRoutes.on(
			"GET",
			"/brightness",
			CapabilitiesMiddleware("Appearance"),
			...GetParameterHandler.handle("ImageSource.I0.Sensor.Brightness"),
		);

		authenticatedRoutes.on(
			"POST",
			"/contrast",
			CapabilitiesMiddleware("Appearance"),
			...SetIntParameterHandler.handle("ImageSource.I0.Sensor.Contrast", 100),
		);

		authenticatedRoutes.on(
			"GET",
			"/contrast",
			CapabilitiesMiddleware("Appearance"),
			...GetParameterHandler.handle("ImageSource.I0.Sensor.Contrast"),
		);

		authenticatedRoutes.on(
			"POST",
			"/sharpness",
			CapabilitiesMiddleware("Appearance"),
			...SetIntParameterHandler.handle("ImageSource.I0.Sensor.Sharpness", 100),
		);

		authenticatedRoutes.on(
			"GET",
			"/sharpness",
			CapabilitiesMiddleware("Appearance"),
			...GetParameterHandler.handle("ImageSource.I0.Sensor.Sharpness"),
		);

		authenticatedRoutes.on(
			"POST",
			"/localcontrast",
			CapabilitiesMiddleware("WideDynamicRange"),
			...SetIntParameterHandler.handle(
				"ImageSource.I0.Sensor.LocalContrast",
				100,
			),
		);

		authenticatedRoutes.on(
			"GET",
			"/localcontrast",
			CapabilitiesMiddleware("WideDynamicRange"),
			...GetParameterHandler.handle("ImageSource.I0.Sensor.LocalContrast"),
		);

		authenticatedRoutes.on(
			"POST",
			"/tonemapping",
			CapabilitiesMiddleware("WideDynamicRange"),
			...SetIntParameterHandler.handle(
				"ImageSource.I0.Sensor.ToneMapping",
				100,
			),
		);

		authenticatedRoutes.on(
			"GET",
			"/tonemapping",
			CapabilitiesMiddleware("WideDynamicRange"),
			...GetParameterHandler.handle("ImageSource.I0.Sensor.ToneMapping"),
		);

		authenticatedRoutes.on(
			"POST",
			"/proportionalspeed",
			CapabilitiesMiddleware("PTZ"),
			...SetIntParameterHandler.handle(
				"PTZ.Various.V1.MaxProportionalSpeed",
				1000,
			),
		);

		authenticatedRoutes.on(
			"GET",
			"/proportionalspeed",
			CapabilitiesMiddleware("PTZ"),
			...GetParameterHandler.handle("PTZ.Various.V1.MaxProportionalSpeed"),
		);

		// This is identical to info/speed, I just couldn't decide where to put it
		authenticatedRoutes.on(
			"GET",
			"/speed",
			CapabilitiesMiddleware("PTZ"),
			...GetSpeedHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/speed",
			CapabilitiesMiddleware("PTZ"),
			...SetSpeedHandler.handle(),
		);

		return [authenticatedRoutes, unauthenticatedRoutes];
	},
	Shutdown: (): void => {},
};

export default SettingsModule;
