import { adminProcedure, protectedProcedure, publicOrProtectedProcedure, router } from '$lib/trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { TRPCError } from '@trpc/server'
import {
	addGeoDataToLocation,
	addGeoDataToLocations,
	prisma,
	Prisma,
	rateIntervals,
	tsQuery,
	UserRole,
} from '$lib/prisma'
import { z } from 'zod'

export type LocationRouter = typeof locationRouter
export type LocationRouterInputs = inferRouterInputs<LocationRouter>
export type LocationRouterOutputs = inferRouterOutputs<LocationRouter>

export const locationRouter = router({
	// region Admin procedures

	/** Get and query all the locations for the admin section  */
	paginate: adminProcedure
		.input(
			z.object({
				query: z.string(), // TODO: Create custom zod schema to replace singleLine and trim

				//
				page: z.number().int().min(0),
				limit: z.number().int().positive().min(1).max(100),

				//
				orderBy: z
					.object({
						displayName: z.enum(['asc', 'desc']).nullish(),
						userId: z.enum(['asc', 'desc']).nullish(),
						typeId: z.enum(['asc', 'desc']).nullish(),
						createdAt: z.enum(['asc', 'desc']).nullish(),
					})
					.transform(val =>
						// TODO: Create and use extended User types
						Prisma.validator<Prisma.LocationOrderByWithAggregationInput[]>()([
							{ displayName: val.displayName || undefined },
							{ userId: val.userId || undefined },
							{ typeId: val.typeId || undefined },
							{ createdAt: val.createdAt || undefined },
						]),
					),
			}),
		)
		.query(async ({ input: { query, page, limit, orderBy } }) => {
			const where: Prisma.LocationWhereInput = {
				deletedAt: null,
			}

			const search = tsQuery(query)
			if (search) {
				where.OR = [
					{ key: { contains: query, mode: 'insensitive' } },
					{ typeId: { search, mode: 'insensitive' } },
					{ displayName: { search, mode: 'insensitive' } },
					{ description: { search, mode: 'insensitive' } },
					{
						user: {
							OR: [
								{ email: { contains: query, mode: 'insensitive' } },
								// { phone: { contains: query, mode: 'insensitive' } },

								// { name: { search, mode: 'insensitive' } }, // Prisma == 💩
								{ firstName: { search, mode: 'insensitive' } },
								{ lastName: { search, mode: 'insensitive' } },
							],
						},
					},
				]
			}

			const [size, items] = await prisma.$transaction([
				prisma.location.count({ where }),
				prisma.location.findMany({
					skip: page * limit,
					take: limit,
					orderBy,
					where,
				}),
			])

			return {
				size,
				limit,
				page,
				items,
			}
		}),

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
				position: z.string().min(3),

				// TODO: Consider making the these fields optional
				category: z.string().min(3),
				checkIn: z.coerce.date(),
				checkOut: z.coerce.date(),
			}),
		)
		.query(async ({ ctx: { user }, input: { position, category, checkIn, checkOut } }) => {
			if (checkIn > checkOut)
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'checkIn date must be less than checkOut date' })

			const positionCheck = await prisma.locationPosition.findUnique({
				where: { id: position },
			})

			if (!positionCheck)
				throw new TRPCError({ code: 'NOT_FOUND', message: 'Invalid position' })

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
					typeId: category,
					reservations: {
						every: {
							OR: [
								{ checkOut: { lte: checkIn } },
								{ checkIn: { gte: checkOut } },
							],
						},
					},
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
