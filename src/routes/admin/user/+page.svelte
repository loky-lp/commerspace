<script lang="ts">
	import type { inferRouterInputs } from '@trpc/server'
	import type { UserRouter } from '$lib/trpc/routers/user'
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	import { createPagination, useAsyncDataOnMount } from '$lib/utils'

	import { Paginator } from '@skeletonlabs/skeleton'
	import { ErrorBanner, LoadingPlaceholder, Page, RefreshButton } from '$lib/components'
	import { get, writable } from 'svelte/store'
	
	const filters = writable<inferRouterInputs<UserRouter>['paginate']>({
			page: 0,
			limit: 25,
			query: '',
			orderBy: {},
	})

	const { data, loading, error, refresh } = useAsyncDataOnMount(() => trpc($page).user.paginate.query(get(filters)))

	const { paginationSettingsStore, onAmountChange, onPageChange} = createPagination(filters, data, refresh)
	$: paginationSettings = $paginationSettingsStore
</script>

<section class="p-2 sm:p-4">
	{#if $error}
		<ErrorBanner error={$error} />
	{:else}
		<Page>
			<span slot="title">Gestione Utenti</span>
			<div slot="extra" class="flex">
				<RefreshButton {loading} {refresh} />
			</div>
			{#if $loading}
				<LoadingPlaceholder />
			{:else}
				Pagina degli utenti
				<Paginator
					bind:settings={paginationSettings}
					showFirstLastButtons
					showPreviousNextButtons
					on:page={onPageChange}
					on:amount={onAmountChange}
				/>
				<pre><code>{JSON.stringify($data, null, 2)}</code></pre>
			{/if}
		</Page>
	{/if}
</section>