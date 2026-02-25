import type { Camera, Observer, Message } from "@/models";
import { WebSocketManager, VAPIXManager } from "@/managers";
import { formatQueryResponse } from "@/utils";
import _ from "lodash";

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

			let response;
			try {
				response = await VAPIXManager.makeAPICall(camera.client, url);
			} catch (error) {
				msg.data = error;
				WebSocketManager.sendMessageToClients(msg);
				return;
			}

			if (!response.ok) {
				msg.data = await response.text();
				WebSocketManager.sendMessageToClients(msg);
				return;
			}

			info = formatQueryResponse(await response.text());

			url = VAPIXManager.URLBuilder(camera.host, "param", {
				action: "list",
				group: param,
			});

			try {
				response = await VAPIXManager.makeAPICall(camera.client, url);
			} catch (error) {
				msg.data = error;
				WebSocketManager.sendMessageToClients(msg);
				return;
			}

			if (!response.ok) {
				msg.data = await response.text();
				WebSocketManager.sendMessageToClients(msg);
				return;
			}

			const proportionalSpeed = formatQueryResponse(await response.text());
			info.proportional_speed = proportionalSpeed[param];
			is_moving = true;
		} else {
			let url = VAPIXManager.URLBuilder(camera.host, "com/ptz", {
				query: "position",
			});

			let response;
			try {
				response = await VAPIXManager.makeAPICall(camera.client, url);
			} catch (error) {
				msg.data = error;
				WebSocketManager.sendMessageToClients(msg);
				return;
			}

			if (!response.ok) {
				msg.data = await response.text();
				WebSocketManager.sendMessageToClients(msg);
				return;
			}

			info = formatQueryResponse(await response.text());

			info.hfov = calculateHFOV(info.zoom, camera);
			info.vfov = calculateVFOV(info.zoom, camera);

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

function calculateHFOV(zoom: number, camera: Camera) {
	zoom = Math.min(zoom, 9999);
	let focalLength =
		camera.specs.focalLength.min +
		((camera.specs.focalLength.max - camera.specs.focalLength.min) *
			(zoom - 1)) /
			9998;

	return _.round(
		2 *
			Math.atan(camera.specs.sensorWidth / (2 * focalLength)) *
			(180 / Math.PI),
		3,
	);
}

function calculateVFOV(zoom: number, camera: Camera) {
	zoom = Math.min(zoom, 9999);
	let focalLength =
		camera.specs.focalLength.min +
		((camera.specs.focalLength.max - camera.specs.focalLength.min) *
			(zoom - 1)) /
			9998;

	return _.round(
		2 *
			Math.atan(camera.specs.sensorHeight / (2 * focalLength)) *
			(180 / Math.PI),
		3,
	);
}
