import { Hono } from "hono";

import * as constants from "@/constants";
import type { Module } from "@/modules/module";

import GetCapabilitiesHandler from "./get_capabilities_handler";

const ConfigModule: Module = {
	name: "Config",
	basePath: "/config",
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

		unauthenticatedRoutes.on(
			"GET",
			"/capabilities/:camera",
			...GetCapabilitiesHandler.handle(),
		);

		return [authenticatedRoutes, unauthenticatedRoutes];
	},
	Shutdown: (): void => {},
};

export default ConfigModule;
