import { protectedProcedure, publicOrProtectedProcedure, router } from '$lib/trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { addGeoDataToLocation, addGeoDataToLocations, prisma, Prisma } from '$lib/prisma'
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
		.query(async ({ ctx: { user }, input: { position } }) => {
			const positionCheck = await prisma.locationPosition.findUnique({
				where: { id: position },
			})

			if (!positionCheck)
				throw new TRPCError({ code: 'NOT_FOUND' })

			const include: Prisma.LocationInclude = {
				rates: true,
				services: true,
			}

			if (user) {
				include.userData = {
					where: { userId: user.id },
				}
			}

			const locations = await prisma.location.findMany({
				where: {
					positionId: position,
					deletedAt: null,
				},
				include,
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

	userData: protectedProcedure
		.input(
			z.object({
				locationId: z.string().uuid(),
				isFavorite: z.boolean().optional(),
			}),
		)
		.mutation(async ({ ctx: { user }, input: { locationId, isFavorite } }) => {
			return await prisma.userLocationData.upsert({
				select: {
					isFavorite: true,
				},
				where: {
					userId_locationId: {
						locationId,
						userId: user.id,
					},
				},
				create: {
					locationId,
					userId: user.id,

					isFavorite: isFavorite ?? false,
				},
				update: {
					isFavorite,
				},
			})
		}),

	// endregion
})
