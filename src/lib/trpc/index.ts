import type { Context } from '$lib/trpc/context'
import { initTRPC } from '@trpc/server'

export const t = initTRPC.context<Context>().create({
	// TODO: Add superjson transformer
	// TODO: Add error formatter
})

/**
 * Create a reusable router
 *
 * @see https://trpc.io/docs/router
 */
export const router = t.router

/**
 * Create a reusable unprotected procedure
 *
 * @see https://trpc.io/docs/procedures
 **/
export const publicProcedure = t.procedure
