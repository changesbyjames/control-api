import { Hono } from "hono";

import * as constants from "@/constants";
import type { Module } from "@/modules/module";
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

		// Absolute imaging
		authenticatedRoute.on(
			"POST",
			"/focus",
			CapabilitiesMiddleware("Focus"),
			...FocusHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/brightness",
			CapabilitiesMiddleware("Brightness"),
			...BrightnessHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/iris",
			CapabilitiesMiddleware("Iris"),
			...IrisHandler.handle(),
		);

		// Relative imaging
		authenticatedRoute.on(
			"POST",
			"/rfocus",
			CapabilitiesMiddleware("Focus"),
			...RFocusHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/rbrightness",
			CapabilitiesMiddleware("Brightness"),
			...RBrightnessHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/riris",
			CapabilitiesMiddleware("Iris"),
			...IRrisHandler.handle(),
		);

		// Auto imaging
		authenticatedRoute.on(
			"POST",
			"/autofocus",
			CapabilitiesMiddleware("Focus"),
			...AutofocusHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/autoiris",
			CapabilitiesMiddleware("Iris"),
			...AutoirisHandler.handle(),
		);

		// Continuous imaging
		authenticatedRoute.on(
			"POST",
			"/cfocus",
			CapabilitiesMiddleware("Focus"),
			...CFocusHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/cbrightness",
			CapabilitiesMiddleware("ContinuousBrightness"),
			...CBrightnessHandler.handle(),
		);

		authenticatedRoute.on(
			"POST",
			"/ciris",
			CapabilitiesMiddleware("ContinuousIris"),
			...CIrisHandler.handle(),
		);

		return [authenticatedRoute, unauthenticatedRoute];
	},
	Shutdown: (): void => {},
};

export default ImagingModule;
