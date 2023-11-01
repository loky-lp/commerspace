import type { RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'

// event parameter are not yet defined, hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
	return {
		// context information
		// user
		// prisma
	}
}

export type Context = inferAsyncReturnType<typeof createContext>;
