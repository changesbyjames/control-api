import { Hono } from "hono";

import * as constants from "@/constants";
import type { Module } from "@/modules/module";

import GetCapabilitiesHandler from "./get_capabilities_handler";

const ConfigModule: Module = {
	name: "Config",
	basePath: "/config",
	Initialize: (config): Hono<{ Variables: constants.Variables }> => {
		const configModule = new Hono<{ Variables: constants.Variables }>();

		configModule.get(
			"/capabilities/:camera",
			GetCapabilitiesHandler.openapi,
			...GetCapabilitiesHandler.handle(),
		);

		return configModule;
	},
	Shutdown: (): void => {},
};

export default ConfigModule;
