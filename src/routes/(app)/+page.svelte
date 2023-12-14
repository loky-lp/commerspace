<script lang="ts">
	// import { useAsyncDataOnMount } from '$lib/utils'
	// import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	// import { derived } from 'svelte/store'
	import { onMount } from 'svelte'
	import { ArrowLeft, ArrowRight } from 'lucide-svelte'
	import { SearchFields } from '$lib/components'

	const categories = $page.data.categories

	const words = [
		'Ufficio',
		'Salone eventi',
		'Coworking',
	]
	let typedText = ''
	let cursor = 0

	/** This implementation with "sleeps" between action is a bit clumsy, it could be executed better */
	async function typingAnimation() {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			if (cursor == words.length) cursor = 0
			const word = words[cursor]

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

	const categoriesShowcase = [
		{
			href: '#TODO',
			displayName: 'Sale per eventi',
			imgUrl: 'https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80',
		},
		{
			href: '#TODO',
			displayName: 'Uffici privati',
			imgUrl: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80',
		},
		{
			href: '#TODO',
			displayName: 'Temporary Store',
			imgUrl: 'https://images.unsplash.com/photo-1622890806166-111d7f6c7c97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80',
		},
	]

	let categoriesSlider: HTMLDivElement
	let isAtInitialPosition = true

	onMount(() => {
		categoriesSlider.addEventListener('scroll', (e: Event) => {
			if ((e?.target as HTMLDivElement | undefined)?.scrollLeft === 0)
				isAtInitialPosition = true
			else
				isAtInitialPosition = false
		})
	})
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
		class="bg-surface-900 border-token border-surface-500 rounded-full w-[clamp(0px,50ch,100vw)] md:w-[clamp(40ch,100ch,100vw)] p-4"
	>
		<SearchFields {categories} on:submit={e => console.log(e)}/>
	</div>
</section>

<!-- TODO Stop the animation once the user scroll await from the first section -->

<section class="py-20 bg-surface-50-900-token">
	<div class="max-w-token-center flex flex-col gap-6">
		<h3 class="px-token text-3xl font-bold">Cerca lo spazio giusto per te</h3>
		<h4 class="px-token text-xl">Scopri tutte le tipologie di annunci su Commerspace!</h4>
		<div class="px-token">
			<div class="flex justify-between">
				<button
					class="btn-icon btn-icon-sm variant-filled-surface"
					class:invisible={isAtInitialPosition}
					on:click={() => categoriesSlider.scrollBy({ top: 0, left: -categoriesSlider.offsetWidth, behavior: 'smooth' })}
				>
					<ArrowLeft />
				</button>
				<button
					class="{isAtInitialPosition ? 'btn btn-sm' : 'btn-icon btn-icon-sm' } variant-filled-surface py-1 gap-2"
					on:click={() => categoriesSlider.scrollBy({ top: 0, left: categoriesSlider.offsetWidth, behavior: 'smooth' })}
				>
					{#if isAtInitialPosition}
						Scorri per scoprire le altre
					{/if}
					<ArrowRight />
				</button>
			</div>
			<div bind:this={categoriesSlider}
			     class="hide-scrollbar max-w-full mx-auto grid grid-flow-col auto-cols-max gap-8 overflow-y-scroll p-4 scroll-ps-4 snap-x snap-mandatory"
			>
				{#each categoriesShowcase as { href, displayName, imgUrl } (displayName)}
					<a {href} class="snap-start flex flex-col gap-4">
						<img src={imgUrl} alt={displayName} class="rounded-container-token">
						<span class="text-xl font-semibold">{displayName}</span>
					</a>
				{/each}
				{#each categoriesShowcase as { href, displayName, imgUrl } (displayName)}
					<a {href} class="snap-start">
						<img src={imgUrl} alt={displayName} class="w-full">
						<span>{displayName}</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
</section>
