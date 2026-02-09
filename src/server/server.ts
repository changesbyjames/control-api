import { Hono } from "hono";
import { serve } from "@hono/node-server";

import * as constants from "@/constants";
import * as managers from "@/managers";
import type { Module } from "@/modules/module";
import AuthorizationMiddleware from "@/server/middleware/authorization";

interface ServiceConfig {
	serverPort: number;
	websocketPort: number;
	moduleMap: { [key: string]: boolean };
}

class Server {
	// public
	readonly authenticatedRoutes = new Hono<{
		Variables: constants.Variables;
	}>();
	readonly unauthenticatedRoutes = new Hono<{
		Variables: constants.Variables;
	}>();

	// private
	#app = new Hono<{
		Variables: constants.Variables;
	}>();
	#sharedKey!: string;
	#serviceConfig!: ServiceConfig;
	#modules: { [key: string]: Module } = {};

	constructor() {
		this.#sharedKey = process.env[constants.sharedKeyKey] ?? "";
		if (!this.#sharedKey) {
			throw new Error("sharedKey not found in environment");
		}

		this.authenticatedRoutes.use(AuthorizationMiddleware(this.#sharedKey));
	}

	registerModule(module: Module) {
		if (this.#serviceConfig.moduleMap[module.name]) {
			this.#modules[module.name] = module;
			const [authenticated, unauthenticated] = module.Initialize({});
			this.authenticatedRoutes.route(module.basePath, authenticated);
			this.unauthenticatedRoutes.route(module.basePath, unauthenticated);
		}
	}

	async initializeManagers() {
		await managers.ConfigManager.loadAllConfigs();

		let allCamConfigs: any[] = managers.ConfigManager.getAllCameraConfigs();
		if (allCamConfigs.length == 0) {
			throw new Error();
		}

		for (const [k, v] of Object.entries(allCamConfigs)) {
			managers.CameraManager.loadCamera(v);
		}

		// Service setup is also done here even though it's not a manager because manager initialization is the first thing that happens
		let serviceConfig: ServiceConfig =
			managers.ConfigManager.getServiceConfig();
		if (!serviceConfig) {
			throw new Error("Service config not found");
		}

		this.#serviceConfig = serviceConfig;
	}

	async startServer() {
		this.#app.route("/", this.unauthenticatedRoutes);
		this.#app.route("/", this.authenticatedRoutes);

		managers.WebSocketManager.setupWebsocket(
			this.#serviceConfig.websocketPort,
			this.#sharedKey,
		);
		serve(
			{
				fetch: this.#app.fetch,
				port: this.#serviceConfig.serverPort,
			},
			(info) => {
				console.log(`Server is running on http://localhost:${info.port}`);
			},
		);
	}
}

export default Server;
