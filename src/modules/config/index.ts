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
		const authenticatedRoute = new Hono<{ Variables: constants.Variables }>();
		const unauthenticatedRoute = new Hono<{
			Variables: constants.Variables;
		}>();

		unauthenticatedRoute.on(
			"GET",
			"/capabilities/:camera",
			...GetCapabilitiesHandler.handle(),
		);

		return [authenticatedRoute, unauthenticatedRoute];
	},
	Shutdown: (): void => {},
};

export default ConfigModule;
