import { adminProcedure, router } from '$lib/trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
// import { TRPCError } from '@trpc/server'
import { prisma, Prisma, tsQuery, userRoles, userStatuses, type UserWhereInput } from '$lib/prisma'
import { z } from 'zod'

export type UserRouter = typeof userRouter
export type UserRouterInputs = inferRouterInputs<UserRouter>
export type UserRouterOutputs = inferRouterOutputs<UserRouter>

export const userRouter = router({
	paginate: adminProcedure
		.input(
			z.object({
				role: z.enum(userRoles).optional(),
				status: z.enum(userStatuses).optional(),
				query: z.string(), // TODO: Create custom zod schema to replace singleLine and trim

				//
				page: z.number().int().min(0),
				limit: z.number().int().positive().min(1).max(100),

				//
				orderBy: z
					.object({
						role: z.enum(['asc', 'desc']).nullish(),
						status: z.enum(['asc', 'desc']).nullish(),
						email: z.enum(['asc', 'desc']).nullish(),
						createdAt: z.enum(['asc', 'desc']).nullish(),
					})
					.transform(val =>
						// TODO: Create and use extended User types
						Prisma.validator<Prisma.UserOrderByWithAggregationInput[]>()([
							{ role: val.role || undefined },
							{ status: val.status || undefined },
							{ email: val.email || undefined },
							{ createdAt: val.createdAt || undefined },
						]),
					),
			}),
		)
		.query(async ({ input }) => {
			const { role: _role, status: _status, query, page, limit, orderBy } = input

			const where: UserWhereInput = {
				deletedAt: null,
			}

			if (_role) where.role = _role
			if (_status) where.status = 'BANNED'

			const search = tsQuery(input.query)
			if (search) {
				where.OR = [
					{ email: { contains: query, mode: 'insensitive' } },
					// { phone: { contains: query, mode: 'insensitive' } },

					{ name: { search, mode: 'insensitive' } },
					{ firstName: { search, mode: 'insensitive' } },
					{ lastName: { search, mode: 'insensitive' } },
				]
			}

			const [size, items] = await prisma.$transaction([
				prisma.user.count({ where }),
				prisma.user.findMany({
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
})
