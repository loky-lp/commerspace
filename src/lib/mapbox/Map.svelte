<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { Map } from 'mapbox-gl'
	import { setMapbox } from '$lib/context'
	import { get, writable } from 'svelte/store'

	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public'

	import 'mapbox-gl/dist/mapbox-gl.css'

	// let map: Map
	let mapElement: HTMLDivElement
	const map = writable<Map | undefined>(undefined)
	setMapbox(map)

	export let lng = 0
	export let lat = 0
	export let zoom = 0

	$: {
		console.log('updating map center')
		// This is done using svelte `get` to avoid unnecessary reactivity of the map store
		const m = get(map)
		if (m) {
			m.setCenter([lng, lat])
		}
	}

	$: {
		console.log('updating map zoom')
		const m = get(map)
		if (m) {
			m.setZoom(zoom)
		}
	}

	function updateViewport() {
		console.log('updating viewport')
		const m = get(map)
		if (!m) return

		zoom = m.getZoom()
		lng = m.getCenter().lng
		lat = m.getCenter().lat
	}

	onMount(async () => {
		console.log('onMount map')
		// await new Promise(r => setTimeout(r, 2000))
		console.log('creating map')

		const m = new Map({
			container: mapElement,
			accessToken: PUBLIC_MAPBOX_TOKEN,
			style: 'mapbox://styles/mapbox/dark-v10', // HACK: Hardcoded style
			center: [lng, lat], // TODO: Set initial coordinates closest to user search
			zoom: zoom, // TODO: Adapt initial zoom to user selection
		})

		m.on('idle', updateViewport)

		map.set(m)
		console.log('map created')
	})

	onDestroy(() => {
		map.update(m => {
			m?.remove()
			return undefined
		})
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
