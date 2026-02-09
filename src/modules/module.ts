import {
	Hono,
	type Handler as HonoHandler,
	type MiddlewareHandler,
} from "hono";

import * as constants from "@/constants";

// Import modules
import DayNightModule from "./daynight";
import PTZModule from "./ptz";
import InfoModule from "./info";
import ImagingModule from "./imaging";
import SettingsModule from "./settings";
import ConfigModule from "./config";

export interface Module {
	name: string;
	basePath: string;
	Initialize: (config: {
		[index: string]: any;
	}) => Hono<{ Variables: constants.Variables }>;
	Shutdown: () => void;
}

export interface Handler {
	openapi: MiddlewareHandler;
	handle: (...props: any) => [HonoHandler, ...HonoHandler[]];
}

export const serveHandler = (
	handler: Handler,
	...props: any
): HonoHandler[] => {
	return [handler.openapi, ...handler.handle(...props)];
};

// Register modules to be loaded here
export const modules: Module[] = [
	PTZModule,
	DayNightModule,
	InfoModule,
	ImagingModule,
	SettingsModule,
	ConfigModule,
];
