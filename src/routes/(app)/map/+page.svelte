<script lang="ts">
	import type { LngLatLike, Map } from 'svelte-maplibre'
	import { MapLibre, Marker, Popup } from 'svelte-maplibre'
	import { streetStyle } from '$lib/utils/map'
	import { onMount } from 'svelte'

	let map: Map

	onMount(() => {
		// Disable 3D pinching
		map.dragRotate.disable()
	})

	let clickedName: string = ''

	const markers: {
		lngLat: LngLatLike
		label: string
		name: string
		open: boolean
	}[] = [
		{
			lngLat: [-122.2993, 47.4464],
			label: 'SEA',
			name: 'Seattle',
			open: false,
		},
		{
			lngLat: [-159.3438, 21.9788],
			label: 'LIH',
			name: 'Lihue',
			open: false,
		},
		{
			lngLat: [2.5479, 49.0097],
			label: 'CDG',
			name: 'Paris Charles de Gaulle',
			open: false,
		},
		{
			lngLat: [-58.5348, -34.82],
			label: 'EZE',
			name: 'Ministro Pistarini',
			open: false,
		},
		{
			lngLat: [18.6021, -33.9715],
			label: 'CPT',
			name: 'Cape Town',
			open: false,
		},
		{
			lngLat: [121.0165, 14.5123],
			label: 'MNL',
			name: 'Ninoy Aquino',
			open: false,
		},
	]
</script>

map libre

<p>
	{#if clickedName}
		You clicked {clickedName}
	{:else}
		Click a marker to see the airport's name.
	{/if}
</p>
<MapLibre
	bind:map
	class="relative w-full aspect-[9/16] max-h-[70vh] sm:max-h-full sm:aspect-video"
	standardControls
	style={streetStyle}
>
	{#each markers as { lngLat, label, name, open } (label)}
		<Marker
			{lngLat}
			on:click={() => (clickedName = name)}
			asButton={true}
			class="bg-red-500 hover:bg-green-500 transition-colors rounded-full px-2"
		>
			<!--			class="border-gray-200 border shadow-2xl focus:outline-2 focus:outline-black w-8 h-8 bg-red-300 text-black rounded-full grid place-items-center"-->
			<span class="palla">
        {label}
      </span>

			<Popup
				anchor="center"
				openOn="click"
				popupClass="map-popup-hide-tip map-popup-place-content"
				bind:open
			>
				<button
					class="absolute top-2 left-2 bg-black/25 rounded-full aspect-square h-5"
					on:click={() => open = !open}
				>
					X
				</button>
				<img src="https://placehold.co/150x100" alt="img">
				<div class="px-2 py-1">
					<h1>{name}</h1>
					<p>description</p>
					<span>$$$/month</span>
				</div>
			</Popup>
		</Marker>
	{/each}
</MapLibre>
<!--				style={streetStyle}-->
<!--				style={`https://raw.githubusercontent.com/teamapps-org/maplibre-gl-styles/main/qwant/style.json`}-->
