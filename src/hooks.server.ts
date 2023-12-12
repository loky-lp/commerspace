import type { Handle } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { createTRPCHandle } from 'trpc-sveltekit'

import { authHandle } from '$lib/auth'
import { UserRole } from '$lib/prisma'
import { router } from '$lib/trpc/routers'
import { createContext } from '$lib/trpc/context'

// TODO: Move the trpc handle in a trpc related file
const tRPCHandle = createTRPCHandle({
	router,
	createContext,
	onError: ({ type, path, error }) =>
		console.error(`Encountered error while trying to process ${type} @ ${path}:`, error),
}) satisfies Handle

/**
 * This handler prevents unauthorized users to access protected routes such as `/host` and '/admin'.
 *
 * It's not the ultimate guard to prevent malicious user from looking at sensitive data, since the JWT it's handled
 * even if it's revoked, but it gives general protection against users that are not being disabled from the backend.
 *
 * The true authorization guard is performed inside the tRPC procedures.
 *
 * @param event
 * @param resolve
 */
const protectedRoutesHandle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/host')) {
		const session = await event.locals.getSession()

		if (!session?.user || session.user.role != UserRole.HOST)
			throw error(404)

	} else if (event.url.pathname.startsWith('/admin')) {
		const session = await event.locals.getSession()

		if (!session?.user || session.user.role != UserRole.ADMIN)
			throw error(404)
	}

	return resolve(event)
}

export const handle = sequence(
	authHandle,
	protectedRoutesHandle,
	tRPCHandle,
)
