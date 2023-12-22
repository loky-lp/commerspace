<script lang="ts">
	import type { PageData } from './$types'
	// import { page } from '$app/stores'
	// TODO: import { trpc } from '$lib/trpc/client'
	import { rateFormat } from '$lib/utils/rate-format'
	import { goto } from '$app/navigation'
	import { SearchFields } from '$lib/components'

	import 'iconify-icon'
	// import { Heart } from 'lucide-svelte'

	export let data: PageData
	const { categories } = data
	// This approach is suboptimal when the page contains a lot of locations,
	// for fine-grained reactivity we have to wait for Svelte 5
	let { locations } = data

	// $: user = $page.data.session?.user

	function handleSearch(e: CustomEvent<FormData>) {
		const position = e.detail.get('position')
		// position is removed to avoid having it in the query params
		e.detail.delete('position')

		const queryParams = Array.from(e.detail.entries())
			// map from tuple to queryParam key=value
			.map(([key, value]) => `${key}=${value}`)
			.join('&')

		goto(`/s/${position}?${queryParams}`)
	}

	// async function handleFavorite(locationId: string) {
	// 	if (!user) {
	// 		goto('/signin') // TODO: Add redirect to the current page after signin
	// 		return
	// 	}
	//
	// 	const locationIndex = locations.findIndex(location => location.id === locationId)
	// 	const initialIsFavorite = locations[locationIndex].isFavorite
	//
	// 	try {
	// 		// Optimistically update the icon
	// 		locations[locationIndex].isFavorite = !initialIsFavorite
	// 		locations = locations
	//
	// 		// TODO: await trpc($page).location.addToFavorites.mutate({ locationId })
	// 	} catch (e: unknown) {
	// 		console.error(e)
	// 		// Revert the changes if something goes wrong
	// 		locations[locationIndex].isFavorite = initialIsFavorite
	// 		locations = locations
	// 	}
	//
	// 	console.log('favorite', locationId)
	// }
</script>

<div class="grid md:grid-cols-2">
	<div class="flex flex-col gap-2 sm:gap-4 p-token">
		<SearchFields {categories} on:submit={handleSearch} />
		<h2 class="text-xl font-bold">
			{locations.length === 1 ? 'È stato trovato un singolo annuncio' : `Sono stati trovati ${locations.length} annunci`}
		</h2>
		{#each locations as { id, typeId, displayName, address, photos, rates, services } (id)}
			<a
				href="/l/{id}"
				class="flex gap-2 bg-surface-hover-token transition-colors border border-surface-300-600-token rounded-container-token p-4"
			>
				<div class="basis-60">
					{#if photos.length > 0}
						<img src={photos[0]} alt={photos[0]}
						     class="rounded-container-token w-full aspect-square object-cover"
						/>
					{:else}
						<img src="https://dummyimage.com/400/dedede/696969&text=Nessuna+foto+presente" alt=""
						     class="rounded-container-token w-fullaspect-square object-cover"
						/>
					{/if}
				</div>
				<div class="flex-1 flex flex-col gap-3">
					<div class="flex items-start">
						<div class="flex-1">
							<p class="font-bold">{typeId}</p>
							<h3 class="font-bold text-2xl mt-3">{displayName}</h3>
						</div>
<!--						<button-->
<!--							class="btn-icon bg-surface-hover-token {isFavorite ? 'text-yellow-500' : 'text-surface-900-50-token'}"-->
<!--							on:click|stopPropagation|preventDefault={() => handleFavorite(id)}-->
<!--						>-->
<!--							{#if isFavorite}-->
<!--								<Heart fill="currentColor" />-->
<!--							{:else}-->
<!--								<Heart />-->
<!--							{/if}-->
<!--						</button>-->
					</div>
					<p>{address}</p>
					<p class="flex flex-wrap gap-2">
						{#each rates as rate (rate.id)}
							<span class="chip bg-surface-200-700-token text-surface-900-50-token">
								{rateFormat(rate)}
							</span>
						{/each}
					</p>
					<p class="flex flex-wrap gap-2">
						{#each services as service}
							<span class="chip text-sm flex gap-2">
								<iconify-icon icon="lucide:heart" /> servizio
							</span>
						{/each}
					</p>
				</div>
			</a>
		{/each}
	</div>
	<div>
		mappa
	</div>
</div>