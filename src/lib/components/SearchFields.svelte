<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	type Category = {
		id: string
	}
	export let categories: Category[]

	let category: string
	let location: string
	let checkIn: Date = new Date()
	let checkOut: Date = new Date()

	function submit() {
		// Form some reason we are not able to generate the FormData from the formElement, hence we need to do it manually
		// const data = new FormData(formElement)
		const data = new FormData()
		data.append('category', category)
		data.append('location', location)
		data.append('checkIn', checkIn.toISOString())
		data.append('checkOut', checkOut.toISOString())
		dispatch('submit', data)
	}
</script>

<form
	class="flex flex-col md:flex-row gap-2"
	on:submit|preventDefault={submit}
>
	<select class="select" required bind:value={category}>
		{#each categories as { id } (id)}
			<option value={id} class="capitalize">{id}</option>
		{/each}
	</select>
	<!-- TODO: Add autocomplete -->
	<input bind:value={location} class="input" placeholder="Dove" required type="text">
	<input class="input" placeholder="Picker" required type="text">
	<button class="btn variant-filled-primary" type="submit">Carica</button>
</form>

