<script lang="ts">
	import { slide } from 'svelte/transition'
	import { page } from '$app/stores'
	import { trpc } from '$lib/trpc/client'
	import { Spinner } from '$lib/components'

	let greeting = 'press the button to load data'
	let loading = false

	const loadData = async () => {
		loading = true
		greeting = await trpc($page).example.palla.query()
		loading = false
	}
</script>

<h6>Loading data in<br /><code>+page.svelte</code></h6>

<pre><code>{JSON.stringify($page.data, null, 2)}</code></pre>

<a
	aria-busy={loading}
	href="#load"
	on:click|preventDefault={loadData}
	role="button"
>Load</a>
<p>{greeting}</p>

<button class="btn {loading ? 'variant-ghost-primary' : 'variant-filled-primary'}"
        disabled={loading} on:click={loadData}
>
	{#if loading}
		<div transition:slide={{ axis: 'x' }} class="mr-3">
			<Spinner class="!w-6" />
		</div>
	{/if}
	Carica
</button>
