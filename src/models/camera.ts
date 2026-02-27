import type DigestClient from "digest-fetch";

interface Resolution {
	width: number;
	height: number;
}

interface MinMax {
	min: number;
	max: number;
}

export interface Specs {
	type: string;
	maxResolution: Resolution;
	hfov: MinMax;
	vfov: MinMax;
	focalLength: MinMax;
	pan: MinMax;
	tilt: MinMax;
	sensorWidth: number;
	sensorHeight: number;
	zoomSteps: [number, number][];
}

export interface Camera {
	name: string;
	host: string;
	client: DigestClient;
	capabilities: Set<string>;
	specs: Specs;
}
