import { readonly, writable } from 'svelte/store'
import { onMount } from 'svelte'
import type { TRPCClientError } from '@trpc/client'
import type { Router } from '$lib/trpc/routers'
import { isError, isTRPCClientError } from '$lib/utils/error'

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
