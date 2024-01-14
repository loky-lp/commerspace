import { adminProcedure, router } from '$lib/trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { z } from 'zod'

export type HostRouter = typeof hostRouter
export type HostRouterInputs = inferRouterInputs<HostRouter>
export type HostRouterOutputs = inferRouterOutputs<HostRouter>

export const hostRouter = router({
	get: adminProcedure
		.input(
			z.object({}),
		)
		.query(async () => {
			return {}
		}),
})
