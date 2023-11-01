import { publicProcedure, router } from '$lib/trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

export type ExampleRouter = typeof exampleRouter
export type RouterInputs = inferRouterInputs<ExampleRouter>
export type RouterOutputs = inferRouterOutputs<ExampleRouter>

export const exampleRouter = router({
	palla: publicProcedure
		.query(async () => {
			await new Promise(r => setTimeout(r, 2000)) // 👈 simulate an expensive operation
			return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`
		}),
})

