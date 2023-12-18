<script lang="ts">
	import type { PageData } from './$types'

	import { onMount } from 'svelte'
	import { SearchFields } from '$lib/components'
	import { goto } from '$app/navigation'

	export let data: PageData
	const { heroWords, categories, showcase } = data

	let typedText = ''
	let cursor = 0

	/** This implementation with "sleeps" between action is a bit clumsy, it could be executed better */
	async function typingAnimation() {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			if (cursor == heroWords.length) cursor = 0
			const word = heroWords[cursor]

			for (const char of word) {
				typedText += char
				await new Promise(r => setTimeout(r, 150))
			}

			await new Promise(r => setTimeout(r, 2000))

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for (const char of typedText) {
				typedText = typedText.slice(0, -1)
				await new Promise(r => setTimeout(r, 100))
			}

			cursor++
			await new Promise(r => setTimeout(r, 200))
		}
	}

	onMount(typingAnimation)

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
</script>

<section
	class="flex flex-col items-center justify-center min-h-screen gap-10 sm:gap-16 bg-gradient-to-br from-cyan-500 to-purple-500 p-token"
>
	<h2
		class="bg-surface-900 px-6 py-2.5 text-xl text-surface-50 font-bold border-token border-surface-500 rounded-full select-none text-center"
	>
		Benvenuto su commerspace
	</h2>
	<h1 class="font-bold text-6xl sm:text-7xl md:text-8xl text-center select-none">
		Cerca il tuo nuovo<br>‎{typedText}
	</h1>
	<div
		class="bg-surface-900 border-token border-surface-500 rounded-[32px] md:rounded-full w-[clamp(0px,50ch,100vw)] md:w-[clamp(40ch,100ch,100vw)] p-4"
	>
		<SearchFields {categories} on:submit={handleSearch} />
	</div>
</section>

<!-- TODO Stop the animation once the user scroll await from the first section -->

<section class="py-20 bg-surface-50-900-token">
	<div class="max-w-token-center flex flex-col gap-6">
		<h3 class="px-token text-3xl font-bold">Cerca lo spazio giusto per te</h3>
		<h4 class="px-token text-xl">Scopri tutte le tipologie di annunci su Commerspace!</h4>
		<div class="px-token w-full flex flex-col md:flex-row gap-8">
			{#each showcase as { href, displayName, imgUrl } (displayName)}
				<a {href} class="flex-1 flex flex-col gap-4">
					<img src={imgUrl} alt={displayName} class="rounded-container-token">
					<span class="text-xl font-semibold">{displayName}</span>
				</a>
			{/each}
		</div>
	</div>
</section>
