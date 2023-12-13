<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { Readable } from 'svelte/store'

	const dispatch = createEventDispatcher()

	type Category = {
		id: string
	}
	export let categories: Readable<Category[]>

</script>

<form
	class="flex flex-col md:flex-row gap-2"
	on:submit|preventDefault={e => dispatch('submit', e)}
>
	<select class="select" required>
		{#each $categories as { id } (id)}
			<option value={id} class="capitalize">{id}</option>
		{/each}
	</select>
	<input class="input" placeholder="Dove" type="text">
	<input class="input" placeholder="Picker" type="text">
	<button class="btn variant-filled-primary" type="submit">Carica</button>
</form>

