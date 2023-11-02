import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { SvelteKitAuth } from '@auth/sveltekit'
import Credentials from '@auth/core/providers/credentials'
import { createTRPCHandle } from 'trpc-sveltekit'

import { router } from '$lib/trpc/routers'
import { createContext } from '$lib/trpc/context'

const authHandle = SvelteKitAuth({
	providers: [
		Credentials({
			name: 'Email e password',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials, req) {
				console.log({ credentials, req })

				return { id: '123', email: 'me@example.com' }
				// return null
			},
		}),
	],
}) satisfies Handle

const tRPCHandle = createTRPCHandle({
	router,
	createContext,
	onError: ({ type, path, error }) =>
		console.error(`Encountered error while trying to process ${type} @ ${path}:`, error),
}) satisfies Handle

export const handle = sequence(authHandle, tRPCHandle)
