<script lang="ts">
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	import { useAsyncDataOnMount } from '$lib/utils'

	import { ErrorBanner, LoadingPlaceholder, Page } from '$lib/components'
	import { Avatar } from '@skeletonlabs/skeleton'
	import { RefreshCw } from 'lucide-svelte'

	const { data, loading, error, refresh } = useAsyncDataOnMount(() => trpc($page).example.hello.query({ name: 'test from lazy' }))

</script>

<section class="p-2 sm:p-4">
	{#if $error}
		<ErrorBanner error={$error} />
	{:else}
		<Page onBack subtitle="subtitle">
			<svelte:fragment slot="header">
				header
			</svelte:fragment>
			<span slot="title">Gestione location</span>
			<svelte:fragment slot="avatar">
				<Avatar src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg" width="w-10" />
			</svelte:fragment>
			<div slot="extra" class="flex">
				<button class="btn-icon btn-icon-sm bg-surface-hover-token" disabled={$loading} on:click={refresh}>
					<span class:animate-spin={$loading}>
						<RefreshCw />
					</span>
				</button>
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
