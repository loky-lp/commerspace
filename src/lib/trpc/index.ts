import type { Context } from '$lib/trpc/context'
import { initTRPC, TRPCError } from '@trpc/server'
import { prisma, UserRole, UserStatus } from '$lib/prisma'
import superjson from 'superjson'

export const t = initTRPC.context<Context>().create({
	transformer: superjson,
	// TODO: Add error formatter
})

/**
 * Create a reusable middleware to ensure users are logged in
 *
 * @see https://trpc.io/docs/middlewares
 */
const isAuthenticated = t.middleware(async ({ next, ctx }) => {
	// TODO: Create guard and check for user validity
	const sessionUser = ctx.session?.user

	if (!sessionUser)
		throw new TRPCError({ code: 'UNAUTHORIZED' })

	// We can't trust JWT data, we need to fetch the user permissions at every request
	const user = await prisma.user.findUnique({ where: { id: sessionUser.id } })

	if (!user || user.deletedAt != null || user.status === UserStatus.BANNED)
		throw new TRPCError({ code: 'UNAUTHORIZED' })

	return next({
		ctx: {
			user,
		},
	})
})

const isMaybeAuthenticated = t.middleware(async ({ next, ctx }) => {
	// TODO: Create guard and check for user validity if present
	return next({
		ctx: {
			user: ctx.session?.user,
		},
	})
})

/**
 * Create reusable middleware to ensure users are logged in and are admins
 *
 * @see https://trpc.io/docs/middlewares
 */
const isAdmin = t.middleware(async ({ next, ctx, path, type, input, rawInput, meta }) => {
	// TODO: Create guard and check for user validity
	const sessionUser = ctx.session?.user

	if (!sessionUser)
		throw new TRPCError({ code: 'UNAUTHORIZED' })

	// We can't trust JWT data, we need to fetch the user permissions at every request
	const user = await prisma.user.findUnique({ where: { id: sessionUser.id } })

	if (!user || user.deletedAt != null || user.status === 'BANNED')
		throw new TRPCError({ code: 'UNAUTHORIZED' })

	if (user.role !== UserRole.ADMIN)
		throw new TRPCError({ code: 'FORBIDDEN' })

	// TODO: Recording activity
	// const start = Date.now()

	// const result = await next({
	return next({
		ctx: {
			user,
		},
	})

	// const durationMs = Date.now() - start
	// if (type === 'mutation') {
	// 	await recordActivity(ctx.prisma, path, {
	// 		userId: user.id,
	// 		data: {
	// 			type,
	// 			path,
	// 			durationMs,
	// 			input,
	// 			rawInput,
	// 			meta,
	// 		},
	// 	})
	// }

	// return result
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
 * Create a reusable protected procedure for admins
 *
 * @see https://trpc.io/docs/procedures
 **/
export const adminProcedure = t.procedure.use(isAdmin)

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
