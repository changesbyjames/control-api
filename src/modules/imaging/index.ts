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
		const authenticatedRoutes = new Hono<{ Variables: constants.Variables }>();
		const unauthenticatedRoutes = new Hono<{
			Variables: constants.Variables;
		}>();

		authenticatedRoutes.use(CameraMiddleware);

		// Absolute imaging
		authenticatedRoutes.on(
			"POST",
			"/focus",
			CapabilitiesMiddleware("Focus"),
			...FocusHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/brightness",
			CapabilitiesMiddleware("Brightness"),
			...BrightnessHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/iris",
			CapabilitiesMiddleware("Iris"),
			...IrisHandler.handle(),
		);

		// Relative imaging
		authenticatedRoutes.on(
			"POST",
			"/rfocus",
			CapabilitiesMiddleware("Focus"),
			...RFocusHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/rbrightness",
			CapabilitiesMiddleware("Brightness"),
			...RBrightnessHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/riris",
			CapabilitiesMiddleware("Iris"),
			...IRrisHandler.handle(),
		);

		// Auto imaging
		authenticatedRoutes.on(
			"POST",
			"/autofocus",
			CapabilitiesMiddleware("Focus"),
			...AutofocusHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/autoiris",
			CapabilitiesMiddleware("Iris"),
			...AutoirisHandler.handle(),
		);

		// Continuous imaging
		authenticatedRoutes.on(
			"POST",
			"/cfocus",
			CapabilitiesMiddleware("Focus"),
			...CFocusHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/cbrightness",
			CapabilitiesMiddleware("ContinuousBrightness"),
			...CBrightnessHandler.handle(),
		);

		authenticatedRoutes.on(
			"POST",
			"/ciris",
			CapabilitiesMiddleware("ContinuousIris"),
			...CIrisHandler.handle(),
		);

		return [authenticatedRoutes, unauthenticatedRoutes];
	},
	Shutdown: (): void => {},
};

export default ImagingModule;
