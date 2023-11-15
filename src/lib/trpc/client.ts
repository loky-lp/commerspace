import type { Router } from '$lib/trpc/routers'
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit'
import superjson from 'superjson'

let defaultBrowserClient: ReturnType<typeof createTRPCClient<Router>>

export function trpc(init?: TRPCClientInit) {
	if (typeof window === 'undefined' || !init)
		return createTRPCClient<Router>({
			init,
			transformer: superjson,
		})

	if (!defaultBrowserClient)
		defaultBrowserClient = createTRPCClient<Router>({
			transformer: superjson,
		})

	return defaultBrowserClient
}
