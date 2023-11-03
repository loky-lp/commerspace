import type { Context } from '$lib/trpc/context'
import { initTRPC, TRPCError } from '@trpc/server'

export const t = initTRPC.context<Context>().create({
	// TODO: Add superjson transformer
	// TODO: Add error formatter
})

/**
 * Create a reusable middleware to ensure users are logged in
 *
 * @see https://trpc.io/docs/middlewares
 */
const isAuthenticated = t.middleware(async ({ next, ctx }) => {
	// TODO: Create guard and check for user validity
	const user = ctx.session?.user

	if (!user)
		throw new TRPCError({ code: 'UNAUTHORIZED' })

	return next({
		ctx: {
			user
		}
	})
})

const isMaybeAuthenticated = t.middleware(async ({ next, ctx }) => {
	// TODO: Create guard and check for user validity if present
	return next({
		ctx: {
			user: ctx.session?.user
		}
	})
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

/**
 * Create a reusable protected procedure
 *
 * @see https://trpc.io/docs/procedures
 **/
export const protectedProcedure = t.procedure.use(isAuthenticated)

/**
 * Create a reusable procedure that can be both public or protected
 *
 * @see https://trpc.io/docs/procedures
 **/
export const publicOrProtectedProcedure = t.procedure.use(isMaybeAuthenticated)

/**
 * Create a reusable middleware
 *
 * @see https://trpc.io/docs/middlewares
 */
export const middleware = t.middleware

/**
 * Create a reusable route-merger
 *
 * @see https://trpc.io/docs/merging-routers
 */
export const mergeRouters = t.mergeRouters
