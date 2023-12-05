import { protectedProcedure, router } from '$lib/trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { prisma } from '$lib/prisma'

export type ExampleRouter = typeof exampleRouter
export type ExampleRouterInputs = inferRouterInputs<ExampleRouter>
export type ExampleRouterOutputs = inferRouterOutputs<ExampleRouter>

export const exampleRouter = router({
	palla: protectedProcedure
		.query(async ({ ctx: { user } }) => {
			// console.log('trpc context', ctx)

			const u = await prisma.user.findUnique({
				where: {
					id: user.id,
				},
			})

			console.log('user', u)

			return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`
		}),
})

