<script lang="ts">
	import { rateFormat } from '$lib/utils/rate-format'
	import { page } from '$app/stores'

	import 'iconify-icon'
	import { Heart } from 'lucide-svelte'

	const size = $page.data.locations.length

</script>

<div class="grid md:grid-cols-2">
	<div class="flex flex-col gap-2 sm:gap-4 p-token">
		<h2>
			{size === 1 ? 'È stato trovato un singolo annuncio' : `Sono stati trovati ${size} annunci`}
		</h2>
		{#each $page.data.locations as { id, type, name, address, rates, services } (id)}
			<a
				href="/l/{id}"
				class="flex gap-2 bg-surface-hover-token transition-colors border border-surface-300-600-token rounded-container-token p-4"
			>
				<div>
					carosello
				</div>
				<div class="flex-1 flex flex-col gap-3">
					<p class="font-bold">{type}</p>
					<h3 class="font-bold text-2xl">{name}</h3>
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
				<div>
					<Heart />
				</div>
			</a>
		{/each}
	</div>
	<div>
		mappa
	</div>
</div>