export type Banner = {
	id: string;
	type: string;
	title?: string;
	content: string;
	url?: string;
	dismissible?: boolean;
	timestamp: number;
};

export enum TTS_RESPONSE_SPLIT {
	PUNCTUATION = 'punctuation',
	PARAGRAPHS = 'paragraphs',
	NONE = 'none'
}

// Spatial/Agricultural Analysis Types for Enhanced Chat Experience
export interface GeoLocation {
	lat: number;
	lng: number;
}

export interface BoundingBox {
	north: number;
	south: number;
	east: number;
	west: number;
}

export interface FieldBoundary {
	type: 'Feature';
	id: string;
	geometry: {
		type: 'Polygon';
		coordinates: number[][][];
	};
	properties: {
		fieldId: string;
		fieldName: string;
		cropType?: string;
		area?: number; // hectares
		owner?: string;
		plantingDate?: string;
		harvestDate?: string;
		notes?: string;
	};
}

export interface SpatialChatMessage {
	id: string;
	type: 'text' | 'spatial' | 'analysis';
	content: string;
	user: string;
	timestamp: string;
	spatialData?: {
		geometry?: any;
		layers?: any[];
		analysis?: any;
	};
}

export interface VegetationLayer {
	id: string;
	name: string;
	type: 'NDVI' | 'NDWI';
	date: string;
	data: any;
	visible: boolean;
	opacity: number;
}
