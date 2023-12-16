import type { RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'

// event parameter are not yet defined, hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
	const session = await event.locals.getSession()

	console.log('trpc context session', session)
	return {
		// event information like ip, useragent etc..
		session,
		// context information
		// user
		// prisma
		// guard:
	}
}

export type Context = inferAsyncReturnType<typeof createContext>;
