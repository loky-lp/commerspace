import { publicProcedure, router } from '$lib/trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
// import { TRPCError } from '@trpc/server'
import { prisma } from '$lib/prisma'
import { z } from 'zod'

export type CategoryRouter = typeof categoryRouter
export type CategoryRouterInputs = inferRouterInputs<CategoryRouter>
export type CategoryRouterOutputs = inferRouterOutputs<CategoryRouter>

export const categoryRouter = router({
	// region Admin procedures

	// endregion

	// region Admin & Host shared procedures

	// endregion

	// region Host procedures

	// endregion

	// region Public procedures

	getAll: publicProcedure
		.input(
			z.object({}),
		)
		.query(async () => {
			return await prisma.locationType.findMany()
		}),

	// endregion
})
