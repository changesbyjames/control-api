import { Hono } from "hono";

import * as constants from "@/constants";
import { RegisterRoute, serveHandler, type Module } from "@/modules/module";
import { CameraMiddleware, CapabilitiesMiddleware } from "@/server/middleware";

import FocusHandler from "./focus_handler";
import BrightnessHandler from "./brightness_handler";
import IrisHandler from "./iris_handler";
import RFocusHandler from "./relative_focus_handler";
import RBrightnessHandler from "./relative_brightness_handler";
import IRrisHandler from "./relative_iris_handler";
import AutofocusHandler from "./autofocus_handler";
import AutoirisHandler from "./autoiris_handler";
import CFocusHandler from "./continuous_focus_handler";
import CBrightnessHandler from "./continuous_brightness_handler";
import CIrisHandler from "./continuous_iris_handler";

const ImagingModule: Module = {
	name: "Imaging",
	basePath: "/imaging",
	Initialize: (config): Hono<{ Variables: constants.Variables }> => {
		const ImagingModule = new Hono<{ Variables: constants.Variables }>();

		ImagingModule.use(...CameraMiddleware);

		// Absolute imaging
		RegisterRoute(
			ImagingModule,
			"POST",
			"/focus",
			CapabilitiesMiddleware("Focus"),
			...serveHandler(FocusHandler),
		);

		RegisterRoute(
			ImagingModule,
			"POST",
			"/brightness",
			CapabilitiesMiddleware("Brightness"),
			...serveHandler(BrightnessHandler),
		);

		RegisterRoute(
			ImagingModule,
			"POST",
			"/iris",
			CapabilitiesMiddleware("Iris"),
			...serveHandler(IrisHandler),
		);

		// Relative imaging
		RegisterRoute(
			ImagingModule,
			"POST",
			"/rfocus",
			CapabilitiesMiddleware("Focus"),
			...serveHandler(RFocusHandler),
		);

		RegisterRoute(
			ImagingModule,
			"POST",
			"/rbrightness",
			CapabilitiesMiddleware("Brightness"),
			...serveHandler(RBrightnessHandler),
		);

		RegisterRoute(
			ImagingModule,
			"POST",
			"/riris",
			CapabilitiesMiddleware("Iris"),
			...serveHandler(IRrisHandler),
		);

		// Auto imaging
		RegisterRoute(
			ImagingModule,
			"POST",
			"/autofocus",
			CapabilitiesMiddleware("Focus"),
			...serveHandler(AutofocusHandler),
		);

		RegisterRoute(
			ImagingModule,
			"POST",
			"/autoiris",
			CapabilitiesMiddleware("Iris"),
			...serveHandler(AutoirisHandler),
		);

		// Continuous imaging
		RegisterRoute(
			ImagingModule,
			"POST",
			"/cfocus",
			CapabilitiesMiddleware("Focus"),
			...serveHandler(CFocusHandler),
		);

		RegisterRoute(
			ImagingModule,
			"POST",
			"/cbrightness",
			CapabilitiesMiddleware("ContinuousBrightness"),
			...serveHandler(CBrightnessHandler),
		);

		RegisterRoute(
			ImagingModule,
			"POST",
			"/ciris",
			CapabilitiesMiddleware("ContinuousIris"),
			...serveHandler(CIrisHandler),
		);

		return ImagingModule;
	},
	Shutdown: (): void => {},
};

export default ImagingModule;
