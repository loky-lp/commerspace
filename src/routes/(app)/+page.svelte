<script lang="ts">
	// import { useAsyncDataOnMount } from '$lib/utils'
	// import { trpc } from '$lib/trpc/client'
	// import { page } from '$app/stores'

	// const {
	// 	data: locationTypes,
	// 	loading: typesLoading,
	// 	error: typesError,
	// 	refresh: typesRefresh,
	// } = useAsyncDataOnMount(() => trpc($page).example.hello.query({ name: 'test from lazy' })) // TODO Correct path
	//
	// const {
	// 	data: locations,
	// 	loading: locationLoading,
	// 	error: locationError,
	// 	refresh: locationRefresh,
	// } = useAsyncDataOnMount(() => trpc($page).example.hello.query({ name: 'test from lazy' })) // TODO Correct path
	//
	// $: loading = $typesLoading || $locationLoading

	let typesSlider: HTMLElement

	const r = [...Array(30).keys()]

	function getImgSrc(i: number) {
		return [
			'https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80',
			'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80',
			'https://images.unsplash.com/photo-1622890806166-111d7f6c7c97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80',
			'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80',
			'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80',
		][i % 5]
	}
</script>

<!-- TODO: Add skeleton for loading -->
<button on:click={() => typesSlider.scrollBy({ top: 0, left: -typesSlider.offsetWidth, behavior: 'smooth' })}>
	Sinistra
</button>
<button on:click={() => typesSlider.scrollBy({ top: 0, left: typesSlider.offsetWidth, behavior: 'smooth' })}>
	Destra
</button>
<nav bind:this={typesSlider}
     class="bar max-w-screen-md mx-auto bg-red-200 grid grid-flow-col auto-cols-max gap-4 overflow-y-scroll p-4 scroll-ps-4 snap-x snap-mandatory"
>
	{#each r as item}
		<div class="bg-red-500 snap-start w-40">
			Categoria {item}
		</div>
	{/each}
</nav>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
	{#each r as item}
		<a class="border rounded-xl" href="#TODO">
			<img src={getImgSrc(item)} alt="" class="w-full rounded-xl">
			<div class="p-2">
				<div class="flex justify-between">
					<span>Location {item}</span>
					<span>Rating</span>
				</div>
				tipo <br>
				disponibilità <br>
				prezzo
			</div>
		</a>
	{/each}
</div>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.bar::-webkit-scrollbar {
		-webkit-appearance: none;
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	.bar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
