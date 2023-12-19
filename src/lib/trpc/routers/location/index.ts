import { publicProcedure, router } from '$lib/trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { prisma } from '$lib/prisma'
import { z } from 'zod'

export type LocationRouter = typeof locationRouter
export type LocationRouterInputs = inferRouterInputs<LocationRouter>
export type LocationRouterOutputs = inferRouterOutputs<LocationRouter>

export const locationRouter = router({
	// region Admin procedures

	// endregion

	// region Admin & Host shared procedures

	// endregion

	// region Host procedures

	// endregion

	// region Public procedures

	get: publicProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ input }) => {
			const location = await prisma.location.findUnique({
				where: { id: input.id },
				include: {
					type: true,
					user: true,
					rates: true,
					services: true,
				},
			})

			if (!location)
				throw new TRPCError({ code: 'NOT_FOUND' })

			return location
		}),

	// endregion
})
