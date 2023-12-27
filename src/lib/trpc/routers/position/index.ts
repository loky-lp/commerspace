import { adminProcedure, publicProcedure, router } from '$lib/trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { prisma } from '$lib/prisma'
import { z } from 'zod'

export type PositionRouter = typeof positionRouter
export type PositionRouterInputs = inferRouterInputs<PositionRouter>
export type PositionRouterOutputs = inferRouterOutputs<PositionRouter>

export const positionRouter = router({
	// region Admin procedures

	create: adminProcedure
		.input(
			z.object({}),
		)
		.mutation(async () => {
			throw new TRPCError({ code: 'NOT_IMPLEMENTED' })
		}),

	// endregion Admin procedures

	// region Public procedures

	getAll: publicProcedure
		.input(
			z.object({}),
		)
		.query(async () => {
			return await prisma.locationPosition.findMany({
				select: {
					id: true,
				},
			})
		}),

	search: publicProcedure
		.input(
			z.object({
				query: z.string().min(1), // TODO: Create custom zod schema to replace singleLine and trim
			}),
		)
		.query(async ({ input: { query } }) => {
			return await prisma.locationPosition.findMany({
				where: {
					id: { contains: query, mode: 'insensitive' },
				},
				take: 50,
			})
		}),

	// endregion Public procedures
})
