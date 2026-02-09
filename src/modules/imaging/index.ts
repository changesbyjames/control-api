import { Hono } from "hono";

import * as constants from "@/constants";
import { serveHandler, type Module } from "@/modules/module";
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
		const imagingModule = new Hono<{ Variables: constants.Variables }>();

		imagingModule.use(...CameraMiddleware);

		// Absolute imaging
		imagingModule.on(
			"POST",
			"/focus",
			CapabilitiesMiddleware("Focus"),
			...serveHandler(FocusHandler),
		);

		imagingModule.on(
			"POST",
			"/brightness",
			CapabilitiesMiddleware("Brightness"),
			...serveHandler(BrightnessHandler),
		);

		imagingModule.on(
			"POST",
			"/iris",
			CapabilitiesMiddleware("Iris"),
			...serveHandler(IrisHandler),
		);

		// Relative imaging
		imagingModule.on(
			"POST",
			"/rfocus",
			CapabilitiesMiddleware("Focus"),
			...serveHandler(RFocusHandler),
		);

		imagingModule.on(
			"POST",
			"/rbrightness",
			CapabilitiesMiddleware("Brightness"),
			...serveHandler(RBrightnessHandler),
		);

		imagingModule.on(
			"POST",
			"/riris",
			CapabilitiesMiddleware("Iris"),
			...serveHandler(IRrisHandler),
		);

		// Auto imaging
		imagingModule.on(
			"POST",
			"/autofocus",
			CapabilitiesMiddleware("Focus"),
			...serveHandler(AutofocusHandler),
		);

		imagingModule.on(
			"POST",
			"/autoiris",
			CapabilitiesMiddleware("Iris"),
			...serveHandler(AutoirisHandler),
		);

		// Continuous imaging
		imagingModule.on(
			"POST",
			"/cfocus",
			CapabilitiesMiddleware("Focus"),
			...serveHandler(CFocusHandler),
		);

		imagingModule.on(
			"POST",
			"/cbrightness",
			CapabilitiesMiddleware("ContinuousBrightness"),
			...serveHandler(CBrightnessHandler),
		);

		imagingModule.on(
			"POST",
			"/ciris",
			CapabilitiesMiddleware("ContinuousIris"),
			...serveHandler(CIrisHandler),
		);

		return imagingModule;
	},
	Shutdown: (): void => {},
};

export default ImagingModule;
