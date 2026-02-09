import { Hono } from "hono";

import * as constants from "@/constants";
import { serveHandler, type Module } from "@/modules/module";
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
		const settingsModule = new Hono<{ Variables: constants.Variables }>();

		settingsModule.use(...CameraMiddleware);

		settingsModule.on(
			"GET",
			"/quickzoom",
			CapabilitiesMiddleware("PTZ", "QuickZoom"),
			...serveHandler(GetParameterHandler, "PTZ.UserAdv.U1.QuickZoom"),
		);

		settingsModule.on(
			"POST",
			"/quickzoom",
			CapabilitiesMiddleware("PTZ", "QuickZoom"),
			...serveHandler(SetParameterHandler, "PTZ.UserAdv.U1.QuickZoom"),
		);

		settingsModule.on(
			"GET",
			"/spotfocus",
			CapabilitiesMiddleware("SpotFocus"),
			...serveHandler(GetParameterHandler, "PTZ.UserAdv.U1.SpotFocus"),
		);

		settingsModule.on(
			"POST",
			"/spotfocus",
			CapabilitiesMiddleware("SpotFocus"),
			...serveHandler(SetParameterHandler, "PTZ.UserAdv.U1.SpotFocus"),
		);

		settingsModule.on(
			"POST",
			"/saturation",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(
				SetIntParameterHandler,
				"ImageSource.I0.Sensor.ColorLevel",
				100,
			),
		);

		settingsModule.on(
			"GET",
			"/saturation",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(GetParameterHandler, "ImageSource.I0.Sensor.ColorLevel"),
		);

		settingsModule.on(
			"POST",
			"/brightness",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(
				SetIntParameterHandler,
				"ImageSource.I0.Sensor.Brightness",
				100,
			),
		);

		settingsModule.on(
			"GET",
			"/brightness",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(GetParameterHandler, "ImageSource.I0.Sensor.Brightness"),
		);

		settingsModule.on(
			"POST",
			"/contrast",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(
				SetIntParameterHandler,
				"ImageSource.I0.Sensor.Contrast",
				100,
			),
		);

		settingsModule.on(
			"GET",
			"/contrast",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(GetParameterHandler, "ImageSource.I0.Sensor.Contrast"),
		);

		settingsModule.on(
			"POST",
			"/sharpness",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(
				SetIntParameterHandler,
				"ImageSource.I0.Sensor.Sharpness",
				100,
			),
		);

		settingsModule.on(
			"GET",
			"/sharpness",
			CapabilitiesMiddleware("Appearance"),
			...serveHandler(GetParameterHandler, "ImageSource.I0.Sensor.Sharpness"),
		);

		settingsModule.on(
			"POST",
			"/localcontrast",
			CapabilitiesMiddleware("WideDynamicRange"),
			...serveHandler(
				SetIntParameterHandler,
				"ImageSource.I0.Sensor.LocalContrast",
				100,
			),
		);

		settingsModule.on(
			"GET",
			"/localcontrast",
			CapabilitiesMiddleware("WideDynamicRange"),
			...serveHandler(
				GetParameterHandler,
				"ImageSource.I0.Sensor.LocalContrast",
			),
		);

		settingsModule.on(
			"POST",
			"/tonemapping",
			CapabilitiesMiddleware("WideDynamicRange"),
			...serveHandler(
				SetIntParameterHandler,
				"ImageSource.I0.Sensor.ToneMapping",
				100,
			),
		);

		settingsModule.on(
			"GET",
			"/tonemapping",
			CapabilitiesMiddleware("WideDynamicRange"),
			...serveHandler(GetParameterHandler, "ImageSource.I0.Sensor.ToneMapping"),
		);

		settingsModule.on(
			"POST",
			"/proportionalspeed",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(
				SetIntParameterHandler,
				"PTZ.Various.V1.MaxProportionalSpeed",
				1000,
			),
		);

		settingsModule.on(
			"GET",
			"/proportionalspeed",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(
				GetParameterHandler,
				"PTZ.Various.V1.MaxProportionalSpeed",
			),
		);

		// This is identical to info/speed, I just couldn't decide where to put it
		settingsModule.on(
			"GET",
			"/speed",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(GetSpeedHandler),
		);

		settingsModule.on(
			"POST",
			"/speed",
			CapabilitiesMiddleware("PTZ"),
			...serveHandler(SetSpeedHandler),
		);

		return settingsModule;
	},
	Shutdown: (): void => {},
};

export default SettingsModule;
