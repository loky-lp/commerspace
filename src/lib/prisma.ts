import type { User as PrismaUser } from '@prisma/client'
import { Prisma, PrismaClient, RateInterval, UserRole, UserStatus } from '@prisma/client'
import Tsquery from 'pg-tsquery'

export * from '@prisma/client'

// Prisma is basically unusable, we need to either re-export manually or create a manual type inference
export type PrismaClientEx = ReturnType<typeof extendPrisma>

export type User = PrismaUser & { name: string }


// region GeoData types

// NOTE: This type must be kept in sync with the database schema, see: prisma/schema.prisma
export type LocationGeoData = {
	id: string
	lng: number
	lat: number
}

export type PublicLocationGeoData = Omit<LocationGeoData, 'id'>

export type LocationGeoDataInput = {
	lng: number
	lat: number
}

export type LocationDeleteGeoDataInput = {
	where: Prisma.LocationWhereUniqueInput
}

export type LocationCreateGeoDataInput = {
	where: Prisma.LocationWhereUniqueInput
	data: LocationGeoDataInput
}

// endregion GeoData types


function extendPrisma(prisma: PrismaClient) {
	return prisma
		.$extends({
			model: {
				location: {
					async setGeoData({ where, data: { lng, lat } }: LocationCreateGeoDataInput) {
						const location = await prisma.location.findUnique({ where, select: { id: true } })
						if (!location?.id) return null
						return await prisma.$queryRaw<LocationGeoData>`
							INSERT INTO "LocationGeoData" (id, "lngLat")
							VALUES (${location.id}::UUID,
											ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 3857))
							RETURNING id, ST_X("lngLat") as lng, ST_Y("lngLat") as lat`
					},
					async deleteGeoData({ where }: LocationDeleteGeoDataInput) {
						const location = await prisma.location.findUnique({ where, select: { id: true } })
						if (!location?.id) return null
						return await prisma.$queryRaw<LocationGeoData>`
							DELETE
							FROM "LocationGeoData"
							WHERE id = ${location.id}::UUID
							RETURNING id, ST_X("lngLat") as lng, ST_Y("lngLat") as lat`
					},
				},
			},
			result: {
				location: {
					// This is currently handled by an async method because extensions on Unsupported types are not supported
					getGeoData: {
						needs: { id: true },
						compute({ id }) {
							/** The return is an array but the values are limited to 1 */
							return () =>
								prisma.$queryRaw<[PublicLocationGeoData]>`
									SELECT ST_X("lngLat") as lng, ST_Y("lngLat") as lat
									FROM "LocationGeoData"
									WHERE id = ${id}::UUID
									LIMIT 1`
						},
					},
				},
				user: {
					name: {
						needs: { firstName: true, lastName: true },
						compute(user) {
							return `${user.firstName} ${user.lastName}`
						},
					},
				},
			},
		})
}

export function createPrismaClient(options?: Prisma.PrismaClientOptions): PrismaClientEx {
	const prisma = new PrismaClient(options)

	// HACK: this dirty hack!!! we should just inline and re-export this call!!!
	return extendPrisma(prisma)
}

export const prisma = createPrismaClient()

export type UserWhereInput = Omit<Prisma.UserWhereInput, 'AND' | 'OR' | 'NOT'> & {
	// Prisma overrides
	AND?: UserWhereInput | UserWhereInput[]
	OR?: UserWhereInput[]
	NOT?: UserWhereInput | UserWhereInput[]

	// Custom properties
	name?: Prisma.StringNullableFilter<'User'> | string | null
}

export type UserWhereUniqueInput = Prisma.AtLeast<UserWhereInput, 'id' | 'email' | 'createdAt'>

// region Utility constants

export const userRoles = Object.values(UserRole) as [keyof typeof UserRole, ...(keyof typeof UserRole)[]]
export const userStatuses = Object.values(UserStatus) as [keyof typeof UserStatus, ...(keyof typeof UserStatus)[]]
export const rateIntervals = Object.values(RateInterval) as [keyof typeof RateInterval, ...(keyof typeof RateInterval)[]]

// endregion Utility constants


// region Utility types

/** Return type for both {@link prisma.location.findUnique} and {@link prisma.location.findFirst} */
export type LocationFindSingleResult = Awaited<ReturnType<typeof prisma.location.findUnique>>
/** Return type for both {@link prisma.location.findUniqueOrThrow} and {@link prisma.location.findFirstOrThrow} */
export type LocationFindSingleOrThrowResult = Awaited<ReturnType<typeof prisma.location.findUniqueOrThrow>>
/** Return type for {@link prisma.location.findMany} */
export type LocationFindManyResult = Awaited<ReturnType<typeof prisma.location.findMany>>

// endregion Utility types


// region Utility functions

export async function addGeoDataToLocation<Location extends LocationFindSingleResult | LocationFindSingleOrThrowResult>(location: Location) {
	const geoData = (await location?.getGeoData())?.[0]
	return {
		...location,
		geoData,
		// HACK: this dirty hack!!!
		// We should just let typescript infer the getGeoData return type,
		// but things are broken when working with generics extending from unions!!!
	} as Location & { geoData: PublicLocationGeoData | undefined }
}

// TODO: Test performance of this code, not sure it's the best way to handle the geoData transformation
export async function addGeoDataToLocations<Locations extends LocationFindManyResult>(locations: Locations) {
	// HACK: this dirty hack!!! Typescript generics are so broken!!!
	return await Promise.all<Promise<Locations[0] & { geoData: PublicLocationGeoData | undefined }>>(
		// HACK: Instead of using [0] to force access the first element we should use a safer option,
		// but ArrayElement destroys the types for some reason
		locations.map<Promise<Locations[0] & { geoData: PublicLocationGeoData | undefined }>>(
			async location => await addGeoDataToLocation<Locations[0]>(location) as Locations[0] & { geoData: PublicLocationGeoData | undefined }
		),
	)
}

// endregion Utility functions


/**
 * Text-Search parser for PostgreSQL
 */
export function tsQuery(query: string | null | undefined): string | undefined {
	const normalizedQuery = (typeof query === 'string' ? query : '').trim().replace(/\s+/g, ' ').replace(/\s/g, '*')
	if (normalizedQuery) {
		const parser = Tsquery()

		return parser(`*${normalizedQuery}*`)
	}

	return undefined
}

// region Query utils

// endregion Query utils
