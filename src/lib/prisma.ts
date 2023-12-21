import type { User as PrismaUser } from '@prisma/client'
import { Prisma, PrismaClient, RateInterval, UserRole, UserStatus } from '@prisma/client'
import Tsquery from 'pg-tsquery'

export * from '@prisma/client'

// Prisma is basically unusable, we need to either re-export manually or create a manual type inference
export type PrismaClientEx = ReturnType<typeof extendPrisma>

export type User = PrismaUser & { name: string }

function extendPrisma(prisma: PrismaClient) {
	return prisma
		.$extends({
			result: {
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
