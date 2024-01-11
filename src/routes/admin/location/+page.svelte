<script lang="ts">
	import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
	import type { LocationRouter } from '$lib/trpc/routers/location'
	import type { ArrayElement } from '$lib/types'
	import { trpc } from '$lib/trpc/client'
	import { page } from '$app/stores'
	import { createPagination, useAsyncDataOnMount } from '$lib/utils'

	import { derived, get, writable } from 'svelte/store'
	import { Paginator } from '@skeletonlabs/skeleton'
	import { ErrorBanner, LoadingPlaceholder, Page, RefreshButton } from '$lib/components'
	import { Search, Trash2 } from 'lucide-svelte'

	type User = ArrayElement<inferRouterOutputs<LocationRouter>['paginate']['items']>

	const filters = writable<inferRouterInputs<LocationRouter>['paginate']>({
		page: 0,
		limit: 25,
		query: '',
		orderBy: {},
	})

	const { data, loading, error, refresh } = useAsyncDataOnMount(() => trpc($page).location.paginate.query(get(filters)))

	const { paginationSettingsStore, onAmountChange, onPageChange } = createPagination(filters, data, refresh)
	$: paginationSettings = $paginationSettingsStore

	const rows = derived(data, $d => $d?.items ?? [])

	function onSelected(user: User) {
		console.log('row selected', user)
	}

	function onInfo(user: User) {
		console.log('user info', user)
	}

	function onDelete(user: User) {
		console.log('user delete', user)
	}
</script>

<section class="p-2 sm:p-4">
	{#if $error}
		<ErrorBanner error={$error} />
	{:else}
		<Page>
			<span slot="title">Gestione Locazioni</span>
			<div slot="extra" class="flex">
				<RefreshButton {loading} {refresh} />
			</div>

			<svelte:fragment>
				<table class="cm-table interactive">
					<thead>
					<tr>
						<th>Nome</th>
						<th>Email</th>
						<th />
					</tr>
					</thead>
					{#if $loading}
						<tr class="cm-table-loading">
							<td colspan="999">
								<LoadingPlaceholder />
							</td>
						</tr>
					{:else if $error}
						<tr class="cm-table-loading">
							<td colspan="999" class="p-4">
								<ErrorBanner error={$error} />
							</td>
						</tr>
					{:else}
						<tbody>
						{#each $rows as row}
							<tr on:click={() => onSelected(row)}>
								<td>{row.displayName}</td>
								<td>{row.userId}</td>
								<td>
									<div class="flex gap-1">
										<button class="btn-icon btn-icon-sm variant-filled-secondary"
										        on:click|stopPropagation={() => onInfo(row)}
										>
											<Search />
										</button>
										<button class="btn-icon btn-icon-sm variant-filled-error"
										        on:click|stopPropagation={() => onDelete(row)}
										>
											<Trash2 />
										</button>
									</div>
								</td>
							</tr>
						{/each}
						</tbody>
					{/if}
					<tfoot>
					<tr>
						<td colspan="999">
							<Paginator
								bind:settings={paginationSettings}
								showFirstLastButtons
								showPreviousNextButtons
								on:page={onPageChange}
								on:amount={onAmountChange}
								disabled={$loading}
							/>
						</td>
					</tr>
					</tfoot>
				</table>
			</svelte:fragment>
		</Page>
	{/if}
</section>
