import { Prisma, PrismaClient } from '@prisma/client'

import type { User as PrismaUser } from '@prisma/client'

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
