<script lang="ts">
	import { Marker } from 'mapbox-gl'
	import { onMount } from 'svelte'
	import { getMapbox } from '$lib/context'

	const map = getMapbox()

	let marker: Marker

	export let lngLat: [number, number]

	onMount(() => {
		console.log('marker onMount', { $map, marker })
		marker = new Marker({})
		marker.setLngLat(lngLat)

		return () => {
			console.log('marker destroy')
			return marker.remove()
		}
	})

	map.subscribe(map => {
		console.log('map subscription', { map, marker })
		if (map && marker)
			marker.addTo(map)
	})
</script>