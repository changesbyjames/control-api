import { Hono } from "hono";

import * as constants from "@/constants";
import { RegisterUnauthenticatedRoute, type Module } from "@/modules/module";

import GetCapabilitiesHandler from "./get_capabilities_handler";
import GetSpecsHandler from "./get_specs_handler";

const ConfigModule: Module = {
	name: "Config",
	basePath: "/config",
	Initialize: (config): Hono<{ Variables: constants.Variables }> => {
		const ConfigModule = new Hono<{ Variables: constants.Variables }>();

		RegisterUnauthenticatedRoute(
			ConfigModule,
			"GET",
			"/capabilities/:camera",
			GetCapabilitiesHandler.openapi,
			...GetCapabilitiesHandler.handle(),
		);

		RegisterUnauthenticatedRoute(
			ConfigModule,
			"GET",
			"/specs/:camera",
			GetSpecsHandler.openapi,
			...GetSpecsHandler.handle(),
		);

		return ConfigModule;
	},
	Shutdown: (): void => {},
};

export default ConfigModule;
