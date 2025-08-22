<script lang="ts">
	import { onMount } from 'svelte';
	import { spatialMapCenter, spatialMapZoom, spatialFields, spatialLayers } from '$lib/stores';
	import type { FieldBoundary, VegetationLayer } from '$lib/types';

	// Props
	export let height = '400px';
	export let width = '100%';

	// Component state
	let mapContainer: HTMLDivElement;
	let map: any = null;
	let L: any = null;

	onMount(async () => {
		// Import Leaflet dynamically
		if (typeof window !== 'undefined') {
			const leaflet = await import('leaflet');
			L = leaflet.default;

			// Initialize map
			initializeMap();
		}
	});

	function initializeMap() {
		if (!mapContainer || !L) return;

		// Create map
		map = L.map(mapContainer, {
			center: [$spatialMapCenter.lat, $spatialMapCenter.lng],
			zoom: $spatialMapZoom,
			zoomControl: true
		});

		// Add base layer - OpenStreetMap
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors'
		}).addTo(map);

		// Add satellite layer option
		const satelliteLayer = L.tileLayer(
			'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			{
				attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
			}
		);

		// Layer control
		L.control.layers(
			{
				'Street Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
				'Satellite': satelliteLayer
			},
			{}
		).addTo(map);

		// Add sample field boundary
		addSampleField();
	}

	function addSampleField() {
		if (!map || !L) return;

		// Sample field boundary for demonstration
		const sampleField: FieldBoundary = {
			type: 'Feature',
			id: 'sample-field-1',
			geometry: {
				type: 'Polygon',
				coordinates: [[
					[-74.01, 40.71],
					[-74.00, 40.71],
					[-74.00, 40.72],
					[-74.01, 40.72],
					[-74.01, 40.71]
				]]
			},
			properties: {
				fieldId: 'sample-field-1',
				fieldName: 'North Field',
				cropType: 'corn',
				area: 12.5,
				plantingDate: '2024-04-15'
			}
		};

		// Add field to map
		const fieldLayer = L.geoJSON(sampleField, {
			style: {
				color: '#22c55e',
				weight: 2,
				opacity: 0.8,
				fillOpacity: 0.3
			}
		}).addTo(map);

		// Add popup
		fieldLayer.bindPopup(`
			<div class="p-2">
				<h3 class="font-semibold text-gray-900">${sampleField.properties.fieldName}</h3>
				<p class="text-sm text-gray-600">Crop: ${sampleField.properties.cropType}</p>
				<p class="text-sm text-gray-600">Area: ${sampleField.properties.area} ha</p>
			</div>
		`);

		// Update store
		spatialFields.update(fields => [...fields, sampleField]);

		// Fit map to field
		map.fitBounds(fieldLayer.getBounds());
	}
</script>

<div class="spatial-map-container rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
	<div 
		bind:this={mapContainer} 
		class="leaflet-map"
		style="height: {height}; width: {width};"
	></div>
</div>

<style>
	.spatial-map-container {
		position: relative;
	}
	
	.leaflet-map {
		background-color: #f8f9fa;
	}

	/* Dark mode support */
	:global(.dark) .leaflet-map {
		background-color: #374151;
	}

	/* Ensure Leaflet controls are visible */
	:global(.leaflet-control-container) {
		font-size: 12px;
	}

	:global(.leaflet-popup-content) {
		margin: 8px;
		line-height: 1.4;
	}
</style>