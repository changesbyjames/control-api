import type { Camera, Observer, Message } from "@/models";
import { WebSocketManager, VAPIXManager } from "@/managers";
import { formatQueryResponse } from "@/utils";

const PTZObserver: Observer = {
	name: "ptz movement",
	cameras: {},
	// example so I don't forget
	// {
	// 	"pushpopoutdoor": [
	// 		"ptz"
	// 	]
	// },
	topics: ["ptz"],
	handler: async (
		camera: Camera,
		topic: string,
		timestamp: number,
		data: any,
	) => {
		let msg: Message = {
			camera: camera.name,
			timestamp: timestamp,
			event: topic,
			data: {},
		};

		let is_moving: boolean;
		let info: Record<string, any>;

		if (data.is_moving == 1) {
			let param = "PTZ.Various.V1.MaxProportionalSpeed";
			let url = VAPIXManager.URLBuilder(camera.host, "com/ptz", {
				query: "speed",
			});

			let response = await VAPIXManager.makeAPICall(camera.client, url);
			info = formatQueryResponse(await response.text());

			url = VAPIXManager.URLBuilder(camera.host, "param", {
				action: "list",
				group: param,
			});

			response = await VAPIXManager.makeAPICall(camera.client, url);

			const proportionalSpeed = formatQueryResponse(await response.text());
			info.proportional_speed = proportionalSpeed[param];
			is_moving = true;
		} else {
			let url = VAPIXManager.URLBuilder(camera.host, "com/ptz", {
				query: "position",
			});

			let response = await VAPIXManager.makeAPICall(camera.client, url);
			info = formatQueryResponse(await response.text());

			is_moving = false;
		}

		msg.data = {
			is_moving: is_moving,
			info,
		};

		WebSocketManager.sendMessageToClients(msg);
	},
};

export default PTZObserver;
