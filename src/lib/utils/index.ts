import type { Readable, Writable } from 'svelte/store'
import { derived, get, readonly, writable } from 'svelte/store'
import { onMount } from 'svelte'
import type { TRPCClientError } from '@trpc/client'
import type { Router } from '$lib/trpc/routers'
import { isError, isTRPCClientError } from '$lib/utils/error'
import type { PaginationSettings } from '@skeletonlabs/skeleton'

// HACK: This function is kind of a cheat, this should be a proper store to allow better typing.
// To easily achieve that, we have to wait for Svelte 5 runes
export function useAsyncDataOnMount<T>(fn: () => Promise<T>) {
	const refreshTrigger = writable(true)
	const loading = writable(true)
	const error = writable<Error | TRPCClientError<Router> | undefined>()
	const data = writable<T | undefined>()

	onMount(async () => {
		// DIRTY HACK
		refreshTrigger.subscribe(async shouldRun => {
			if (!shouldRun) return

			loading.set(true)
			try {
				// const palla = await fn()
				// data.set(palla)
				data.set(await fn())
			} catch (e: unknown) {
				if (isTRPCClientError(e))
					error.set(e)
				else if (isError(e))
					error.set(e)
			} finally {
				loading.set(false)
			}

			refreshTrigger.set(false)
		})
	})

	return {
		data: readonly(data),
		loading: readonly(loading),
		error: readonly(error),
		refresh: () => refreshTrigger.set(true),
	}
}

export type PaginationFilters = {
	page: number,
	limit: number,
	query: string,
	orderBy: {
		[P in string]: 'asc' | 'desc' | null | undefined
	}
}

export type DataWithPagination = {
	size: number
	page: number,
	limit: number,
}

export function createPagination<F extends PaginationFilters, D extends DataWithPagination>(filters: Writable<F>, data: Readable<D | undefined>, refresh: () => void) {
	// PLS Svelte 5 become stable fast
	const paginationSettingsStore = derived([filters, data], ([$f, $d]) => {
		return {
			page: $f.page,
			limit: $f.limit,
			size: $d?.size ?? 0,
			amounts: [5, 25, 50, 100],
		} satisfies PaginationSettings
	})

	return {
		paginationSettingsStore,
		onAmountChange(e: CustomEvent) {
			const { page, limit } = get(filters)

			// Calculate new page index based on the new page size
			filters.update(f => {
				f.page = Math.floor(page * limit / e.detail)
				f.limit = e.detail
				return f
			})

			refresh()
		},
		onPageChange(e: CustomEvent) {
			filters.update(f => {
				f.page = e.detail
				return f
			})
			refresh()
		},
	}
}
