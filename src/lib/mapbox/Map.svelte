<script lang="ts">
	import { onMount } from 'svelte'
	import { Map } from 'mapbox-gl'
	import { setMapbox } from '$lib/context'
	import { writable } from 'svelte/store'

	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public'

	import 'mapbox-gl/dist/mapbox-gl.css'

	// let map: Map
	let mapElement: HTMLDivElement
	const map = writable<Map | undefined>(undefined)
	setMapbox(map)


	onMount(async () => {
		console.log('onMount map')
		// await new Promise(r => setTimeout(r, 2000))
		console.log('creating map')
		map.set(new Map({
			container: mapElement,
			accessToken: PUBLIC_MAPBOX_TOKEN,
			style: 'mapbox://styles/mapbox/dark-v10', // HACK: Hardcoded style
			center: [-74.5, 40], // TODO: Set initial coordinates closest to user search
			zoom: 9, // TODO: Adapt initial zoom to user selection
		}))
		console.log('map created')
	})
</script>

<div class="map-wrap">
	<div bind:this={mapElement} class="map" />
</div>
{#if map}
	<slot />
{/if}

<style>
	.map-wrap {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
	}
</style>
