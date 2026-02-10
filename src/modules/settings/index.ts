import { Hono } from "hono";

import * as constants from "@/constants";
import { RegisterRoute, serveHandler, type Module } from "@/modules/module";
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
	Initialize: (config): Hono<{ Variables: constants.Variables }> => {
		const SettingsModule = new Hono<{ Variables: constants.Variables }>();

		SettingsModule.use(...CameraMiddleware);

		RegisterRoute(
			SettingsModule,
			"GET",
			"/quickzoom",
			CapabilitiesMiddleware("PTZ", "QuickZoom"),
			...serveHandler(GetParameterHandler, "PTZ.UserAdv.U1.QuickZoom"),
		);

		RegisterRoute(
			SettingsModule,
			"POST",
			"/quickzoom",
			CapabilitiesMiddleware("PTZ", "QuickZoom"),
			...serveHandler(SetParameterHandler, "PTZ.UserAdv.U1.QuickZoom"),
		);

		RegisterRoute(
			SettingsModule,
			"GET",
			"/spotfocus",
			CapabilitiesMiddleware("SpotFocus"),
			...serveHandler(GetParameterHandler, "PTZ.UserAdv.U1.SpotFocus"),
		);

		RegisterRoute(
			SettingsModule,
			"POST",
			"/spotfocus",
			CapabilitiesMiddleware("SpotFocus"),
			...serveHandler(SetParameterHandler, "PTZ.UserAdv.U1.SpotFocus"),
		);

		RegisterRoute(
			SettingsModule,
			"POST",
			"/saturation",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(
				SetIntParameterHandler,
				"ImageSource.I0.Sensor.ColorLevel",
				100,
			),
		);

		RegisterRoute(
			SettingsModule,
			"GET",
			"/saturation",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(GetParameterHandler, "ImageSource.I0.Sensor.ColorLevel"),
		);

		RegisterRoute(
			SettingsModule,
			"POST",
			"/brightness",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(
				SetIntParameterHandler,
				"ImageSource.I0.Sensor.Brightness",
				100,
			),
		);

		RegisterRoute(
			SettingsModule,
			"GET",
			"/brightness",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(GetParameterHandler, "ImageSource.I0.Sensor.Brightness"),
		);

		RegisterRoute(
			SettingsModule,
			"POST",
			"/contrast",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(
				SetIntParameterHandler,
				"ImageSource.I0.Sensor.Contrast",
				100,
			),
		);

		RegisterRoute(
			SettingsModule,
			"GET",
			"/contrast",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(GetParameterHandler, "ImageSource.I0.Sensor.Contrast"),
		);

		RegisterRoute(
			SettingsModule,
			"POST",
			"/sharpness",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(
				SetIntParameterHandler,
				"ImageSource.I0.Sensor.Sharpness",
				100,
			),
		);

		RegisterRoute(
			SettingsModule,
			"GET",
			"/sharpness",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(GetParameterHandler, "ImageSource.I0.Sensor.Sharpness"),
		);

		RegisterRoute(
			SettingsModule,
			"POST",
			"/localcontrast",
			CapabilitiesMiddleware("WideDynamicRange"),
			...serveHandler(
				SetIntParameterHandler,
				"ImageSource.I0.Sensor.LocalContrast",
				100,
			),
		);

		RegisterRoute(
			SettingsModule,
			"GET",
			"/localcontrast",
			CapabilitiesMiddleware("WideDynamicRange"),
			...serveHandler(
				GetParameterHandler,
				"ImageSource.I0.Sensor.LocalContrast",
			),
		);

		RegisterRoute(
			SettingsModule,
			"POST",
			"/tonemapping",
			CapabilitiesMiddleware("WideDynamicRange"),
			...serveHandler(
				SetIntParameterHandler,
				"ImageSource.I0.Sensor.ToneMapping",
				100,
			),
		);

		RegisterRoute(
			SettingsModule,
			"GET",
			"/tonemapping",
			CapabilitiesMiddleware("WideDynamicRange"),
			...serveHandler(GetParameterHandler, "ImageSource.I0.Sensor.ToneMapping"),
		);

		RegisterRoute(
			SettingsModule,
			"POST",
			"/proportionalspeed",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(
				SetIntParameterHandler,
				"PTZ.Various.V1.MaxProportionalSpeed",
				1000,
			),
		);

		RegisterRoute(
			SettingsModule,
			"GET",
			"/proportionalspeed",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(
				GetParameterHandler,
				"PTZ.Various.V1.MaxProportionalSpeed",
			),
		);

		// This is identical to info/speed, I just couldn't decide where to put it
		RegisterRoute(
			SettingsModule,
			"GET",
			"/speed",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(GetSpeedHandler),
		);

		RegisterRoute(
			SettingsModule,
			"POST",
			"/speed",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(SetSpeedHandler),
		);

		return SettingsModule;
	},
	Shutdown: (): void => {},
};

export default SettingsModule;
