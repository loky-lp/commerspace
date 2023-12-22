import { publicOrProtectedProcedure, router } from '$lib/trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { addGeoDataToLocation, addGeoDataToLocations, prisma } from '$lib/prisma'
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

	/** TODO DOC: Procedure for public search page */
	search: publicOrProtectedProcedure
		.input(
			z.object({
				// TODO: Add type, check-in and check-out dates for filtering
				position: z.string().min(3),
			}),
		)
		.query(async ({ input: { position } }) => {
			// TODO: Add favorite field to the location if user is authenticated

			const locations = await prisma.location.findMany({
				where: {
					positionId: position,
				},
				include: {
					rates: true,
					services: true,
				},
			})

			return await addGeoDataToLocations(locations)
		}),

	/** TODO DOC: Procedure for public location page */
	get: publicOrProtectedProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.query(async ({ input }) => {
			// TODO: Add favorite field to the location if user is authenticated
			const location = await prisma.location.findUnique({
				where: { id: input.id },
				include: {
					user: true,
					rates: true,
					services: true,
				},
			})

			if (!location)
				throw new TRPCError({ code: 'NOT_FOUND' })

			return await addGeoDataToLocation(location)
		}),

	// endregion
})
