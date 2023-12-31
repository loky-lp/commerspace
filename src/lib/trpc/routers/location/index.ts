import { protectedProcedure, publicOrProtectedProcedure, router } from '$lib/trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { TRPCError } from '@trpc/server'
import {
	addGeoDataToLocation,
	addGeoDataToLocations,
	prisma,
	Prisma,
	rateIntervals,
	UserRole,
} from '$lib/prisma'
import { z } from 'zod'

export type LocationRouter = typeof locationRouter
export type LocationRouterInputs = inferRouterInputs<LocationRouter>
export type LocationRouterOutputs = inferRouterOutputs<LocationRouter>

export const locationRouter = router({
	// region Admin procedures

	// endregion

	// region Admin & Host shared procedures

	/** Create a new Location, procedure shared for both Admins and Hosts */
	create: protectedProcedure
		.input(
			z.object({
				displayName: z.string().min(3),
				description: z.string().min(3),
				type: z.string().min(1).toLowerCase(),
				position: z.string().min(3),
				address: z.string().min(3),
			}),
		)
		.mutation(async ({ ctx: { user }, input }) => {
			// Check the user role
			if (user.role !== UserRole.HOST && user.role !== UserRole.ADMIN)
				throw new TRPCError({ code: 'FORBIDDEN' })

			const typeCheck = await prisma.locationType.findUnique({
				where: { id: input.type },
			})
			// TODO Check position

			// Users are not allowed to create location types from this procedure
			if (!typeCheck)
				throw new TRPCError({ code: 'BAD_REQUEST' })

			// TODO Define the creation flow if the user is ADMIN

			return await prisma.location.create({
				data: {
					user: { connect: { id: user.id } },
					displayName: input.displayName,
					description: input.description,
					type: { connect: { id: input.type } },
					position: { connect: { id: 'TODO' } }, // TODO Use Mapbox reverse geocoding API to get the position from the 'address
					address: input.address,
				},
			})
		}),

	/** Delete a specific Location, procedure shared for both Admins and Hosts */
	delete: protectedProcedure
		.input(
			z.object({
				id: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx: { user }, input }) => {
			// Check the user role
			if (user.role !== UserRole.HOST && user.role !== UserRole.ADMIN)
				throw new TRPCError({ code: 'FORBIDDEN' })

			const location = await prisma.location.findUnique({ where: { id: input.id } })

			if (!location)
				throw new TRPCError({ code: 'NOT_FOUND' })

			// Hosts are not allowed to perform actions on locations from other users
			if (user.role === 'HOST' && location.userId !== user.id)
				throw new TRPCError({ code: 'FORBIDDEN' })

			await prisma.location.update({
				where: { id: input.id },
				data: { deletedAt: new Date() },
			})
		}),

	/** Create a new LocationRate for the specified location, procedure shared for both Admins and Hosts */
	createRate: protectedProcedure
		.input(
			z.object({
				locationId: z.string().uuid(),

				//
				price: z.number().int().positive().min(100),
				// HACK: Max value arbitrary set to 12, TODO: Decide the max value
				quantity: z.number().int().positive().min(1).max(12),
				interval: z.enum(rateIntervals),
			}),
		)
		.mutation(async ({ ctx: { user }, input }) => {
			if (user.role !== UserRole.HOST && user.role !== UserRole.ADMIN)
				throw new TRPCError({ code: 'FORBIDDEN' })

			const location = await prisma.location.findUnique({ where: { id: input.locationId } })

			if (!location)
				throw new TRPCError({ code: 'NOT_FOUND' })

			// Hosts are not allowed to perform actions on locations from other users
			if (user.role === UserRole.HOST && location.userId !== user.id)
				throw new TRPCError({ code: 'FORBIDDEN' })

			return await prisma.locationRate.create({
				data: {
					location: { connect: { id: input.locationId } },
					interval: input.interval,
					quantity: 1,
					price: 1,
				},
			})
		}),

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
				services: {
					include: {
						service: true,
					},
				},
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

			return await addGeoDataToLocations<typeof locations>(locations)
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
