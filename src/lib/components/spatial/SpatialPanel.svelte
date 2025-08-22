<script lang="ts">
	import { showSpatialPanel, spatialFields, spatialEnabled } from '$lib/stores';
	import SpatialMap from './SpatialMap.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// Toggle spatial features
	function toggleSpatial() {
		spatialEnabled.update(enabled => !enabled);
		if ($spatialEnabled) {
			showSpatialPanel.set(true);
		}
	}

	// Close spatial panel
	function closeSpatialPanel() {
		showSpatialPanel.set(false);
	}

	// Spatial analysis actions
	function analyzeCropHealth() {
		dispatch('spatialAction', {
			type: 'crop_health',
			message: 'Analyze crop health in my selected field using latest satellite imagery'
		});
	}

	function predictYield() {
		dispatch('spatialAction', {
			type: 'yield_prediction', 
			message: 'Predict yield for this growing season based on current field conditions'
		});
	}

	function assessWaterStress() {
		dispatch('spatialAction', {
			type: 'water_stress',
			message: 'Assess water stress levels and provide irrigation recommendations'
		});
	}
</script>

<!-- Spatial Toggle Button (always visible in chat) -->
<button
	class="spatial-toggle-btn"
	class:active={$spatialEnabled}
	on:click={toggleSpatial}
	title="Toggle Agricultural Spatial Analysis"
>
	🌾 Spatial
</button>

<!-- Spatial Panel (shown when enabled) -->
{#if $showSpatialPanel}
	<div class="spatial-panel">
		<div class="spatial-panel-header">
			<h3 class="panel-title">
				🛰️ Agricultural Analysis
			</h3>
			<button 
				class="close-btn"
				on:click={closeSpatialPanel}
				title="Close spatial panel"
			>
				✕
			</button>
		</div>

		<div class="spatial-panel-content">
			<!-- Map Section -->
			<div class="map-section">
				<h4 class="section-title">Field Map</h4>
				<SpatialMap height="300px" />
			</div>

			<!-- Quick Actions -->
			<div class="actions-section">
				<h4 class="section-title">Quick Analysis</h4>
				<div class="action-buttons">
					<button 
						class="action-btn health"
						on:click={analyzeCropHealth}
					>
						🌡️ Crop Health
					</button>
					<button 
						class="action-btn yield"
						on:click={predictYield}
					>
						📈 Yield Forecast
					</button>
					<button 
						class="action-btn water"
						on:click={assessWaterStress}
					>
						💧 Water Stress
					</button>
				</div>
			</div>

			<!-- Field Summary -->
			{#if $spatialFields.length > 0}
				<div class="fields-section">
					<h4 class="section-title">Fields ({$spatialFields.length})</h4>
					{#each $spatialFields as field}
						<div class="field-item">
							<div class="field-info">
								<span class="field-name">{field.properties.fieldName}</span>
								<span class="field-details">
									{field.properties.cropType || 'No crop'} • 
									{field.properties.area || 0} ha
								</span>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.spatial-toggle-btn {
		@apply px-3 py-2 rounded-lg text-sm font-medium;
		@apply bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800;
		@apply text-green-700 dark:text-green-300;
		@apply border border-green-300 dark:border-green-700;
		@apply transition-all duration-200;
		@apply flex items-center space-x-2;
	}

	.spatial-toggle-btn.active {
		@apply bg-green-500 hover:bg-green-600;
		@apply text-white border-green-500;
	}

	.spatial-panel {
		@apply fixed right-4 top-20 z-50;
		@apply bg-white dark:bg-gray-800;
		@apply border border-gray-300 dark:border-gray-600;
		@apply rounded-lg shadow-2xl;
		@apply w-96 max-h-[80vh] overflow-y-auto;
	}

	.spatial-panel-header {
		@apply flex items-center justify-between p-4;
		@apply border-b border-gray-200 dark:border-gray-700;
	}

	.panel-title {
		@apply font-semibold text-gray-900 dark:text-white;
	}

	.close-btn {
		@apply text-gray-500 hover:text-gray-700 dark:hover:text-gray-300;
		@apply text-lg leading-none;
	}

	.spatial-panel-content {
		@apply p-4 space-y-4;
	}

	.section-title {
		@apply font-medium text-gray-900 dark:text-white text-sm mb-2;
	}

	.action-buttons {
		@apply grid grid-cols-1 gap-2;
	}

	.action-btn {
		@apply w-full px-3 py-2 rounded-md text-sm;
		@apply bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600;
		@apply text-gray-700 dark:text-gray-300;
		@apply border border-gray-300 dark:border-gray-600;
		@apply transition-colors duration-200;
		@apply flex items-center justify-center space-x-2;
	}

	.action-btn.health {
		@apply bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30;
		@apply text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700;
	}

	.action-btn.yield {
		@apply bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30;
		@apply text-green-700 dark:text-green-300 border-green-300 dark:border-green-700;
	}

	.action-btn.water {
		@apply bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/30;
		@apply text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700;
	}

	.field-item {
		@apply p-3 bg-gray-50 dark:bg-gray-700 rounded-md;
		@apply border border-gray-200 dark:border-gray-600;
	}

	.field-name {
		@apply block font-medium text-gray-900 dark:text-white;
	}

	.field-details {
		@apply text-sm text-gray-500 dark:text-gray-400;
	}

	/* Mobile responsiveness */
	@media (max-width: 640px) {
		.spatial-panel {
			@apply right-2 left-2 w-auto;
		}
		
		.action-buttons {
			@apply grid-cols-1;
		}
	}
</style>