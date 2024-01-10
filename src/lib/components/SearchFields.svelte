<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { AutocompleteOption, PopupSettings } from '@skeletonlabs/skeleton'
	import { Autocomplete, popup } from '@skeletonlabs/skeleton'
	import { page } from '$app/stores'

	const dispatch = createEventDispatcher<{
		submit: FormData
	}>()

	type Category = {
		id: string
	}
	export let categories: Category[]

	let category: string = $page.url.searchParams.get('category') || categories[0].id
	let position: string = $page.url.pathname.includes('/s/') ? $page.url.pathname.split('/')[2] : ''
	let checkIn: Date = new Date()
	let checkOut: Date = new Date()
	checkOut.setDate(checkOut.getDate() + 6)

	function submit() {
		// Form some reason we are not able to generate the FormData from the formElement, hence we need to do it manually
		// const data = new FormData(formElement)
		const data = new FormData()
		data.append('category', category)
		data.append('position', position)
		data.append('checkIn', checkIn.toISOString().split('T')[0])
		data.append('checkOut', checkOut.toISOString().split('T')[0])
		dispatch('submit', data)
	}

	let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom',
	}

	export let positions: { id: string }[]
	$: positionOptions = positions.map<AutocompleteOption<string, never>>(({ id }) => ({ value: id, label: id }))

	function handleSelection(event: CustomEvent<AutocompleteOption>): void {
		position = event.detail.label
	}
</script>

<form
	class="flex flex-col md:flex-row gap-2"
	on:submit|preventDefault={submit}
>
	<select bind:value={category} class="select" required>
		{#each categories as { id } (id)}
			<option value={id} class="capitalize">{id}</option>
		{/each}
	</select>
	<input
		autocomplete="off"
		bind:value={position}
		class="input"
		name="position-search"
		placeholder="Dove"
		required
		type="search"
		use:popup={popupSettings}
	/>
	<div class="card w-full max-w-sm p-2 pr-1 overflow-y-hidden" data-popup="popupAutocomplete" tabindex="-1">
		<div class="max-h-48 overflow-y-auto pr-1">
			<Autocomplete
				bind:input={position}
				emptyState="Nessuna posizione trovata"
				on:selection={handleSelection}
				options={positionOptions}
			/>
		</div>
	</div>
	<input class="input" placeholder="Picker" required type="text">
	<button class="btn variant-filled-primary" type="submit">Carica</button>
</form>

