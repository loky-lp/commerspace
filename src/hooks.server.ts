import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { createTRPCHandle } from 'trpc-sveltekit'

import { authHandle } from '$lib/auth'
import { router } from '$lib/trpc/routers'
import { createContext } from '$lib/trpc/context'

const tRPCHandle = createTRPCHandle({
	router,
	createContext,
	onError: ({ type, path, error }) =>
		console.error(`Encountered error while trying to process ${type} @ ${path}:`, error),
}) satisfies Handle

export const handle = sequence(authHandle, tRPCHandle)
