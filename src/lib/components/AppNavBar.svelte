<script lang="ts">
	/**
	 * The `flowbite-svelte` `Navbar` that doesn't break shit for no reason
	 */
	import { writable } from 'svelte/store'
	import { setContext } from 'svelte'

	// Creating context for underlying `flowbite-svelte` components
	let hidden = writable(true)
	setContext('navHidden', hidden)
</script>

<nav class="bg-white text-gray-700 border-b-2 border-gray-100 divide-gray-100 px-2 sm:px-4 py-2.5 w-full">
	<div class="mx-auto flex flex-wrap justify-between items-center container">
		<slot />
	</div>
</nav>