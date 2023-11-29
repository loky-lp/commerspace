<script lang="ts">
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	import { useAsyncDataOnMount } from '$lib/utils'

	import { LoadingPlaceholder, Page } from '$lib/components'
	import { Avatar, Button } from 'flowbite-svelte'
	import { RotateOutline } from 'flowbite-svelte-icons'
	import ErrorBanner from '$lib/components/ErrorBanner.svelte'

	const { data, loading, error, refresh } = useAsyncDataOnMount(() => trpc($page).example.hello.query({ name: 'test from lazy' }))

</script>

<section class="p-2 sm:p-4">
	{#if $error}
		<ErrorBanner error={$error} />
	{:else}
		<Page onBack subtitle="subtitle">
			<div slot="header">header</div>
			<span slot="title">Gestione location</span>
			<Avatar slot="avatar" src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg" />
			<div slot="extra" class="flex">
				<Button pill color="alternative" class="!p-2 !ring-0" disabled={$loading} on:click={refresh}>
					<span class:animate-spin={$loading}>
						<RotateOutline />
					</span>
				</Button>
			</div>
			{#if $loading}
				<LoadingPlaceholder />
			{:else}
				Pagina delle locations
				<pre><code>{JSON.stringify($data, null, 2)}</code></pre>
			{/if}
		</Page>
	{/if}
</section>
