import { Hono } from "hono";

import * as constants from "@/constants";
import { RegisterRoute, type Module } from "@/modules/module";
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

		ImagingModule.use(CameraMiddleware);

		// Absolute imaging
		RegisterRoute(
			ImagingModule,
			"POST",
			"/focus",
			CapabilitiesMiddleware("Focus"),
			...FocusHandler.handle(),
		);

		RegisterRoute(
			ImagingModule,
			"POST",
			"/brightness",
			CapabilitiesMiddleware("Brightness"),
			...BrightnessHandler.handle(),
		);

		RegisterRoute(
			ImagingModule,
			"POST",
			"/iris",
			CapabilitiesMiddleware("Iris"),
			...IrisHandler.handle(),
		);

		// Relative imaging
		RegisterRoute(
			ImagingModule,
			"POST",
			"/rfocus",
			CapabilitiesMiddleware("Focus"),
			...RFocusHandler.handle(),
		);

		RegisterRoute(
			ImagingModule,
			"POST",
			"/rbrightness",
			CapabilitiesMiddleware("Brightness"),
			...RBrightnessHandler.handle(),
		);

		RegisterRoute(
			ImagingModule,
			"POST",
			"/riris",
			CapabilitiesMiddleware("Iris"),
			...IRrisHandler.handle(),
		);

		// Auto imaging
		RegisterRoute(
			ImagingModule,
			"POST",
			"/autofocus",
			CapabilitiesMiddleware("Focus"),
			...AutofocusHandler.handle(),
		);

		RegisterRoute(
			ImagingModule,
			"POST",
			"/autoiris",
			CapabilitiesMiddleware("Iris"),
			...AutoirisHandler.handle(),
		);

		// Continuous imaging
		RegisterRoute(
			ImagingModule,
			"POST",
			"/cfocus",
			CapabilitiesMiddleware("Focus"),
			...CFocusHandler.handle(),
		);

		RegisterRoute(
			ImagingModule,
			"POST",
			"/cbrightness",
			CapabilitiesMiddleware("ContinuousBrightness"),
			...CBrightnessHandler.handle(),
		);

		RegisterRoute(
			ImagingModule,
			"POST",
			"/ciris",
			CapabilitiesMiddleware("ContinuousIris"),
			...CIrisHandler.handle(),
		);

		return ImagingModule;
	},
	Shutdown: (): void => {},
};

export default ImagingModule;
