import { router } from '$lib/trpc'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
// import { TRPCError } from '@trpc/server'
// import { prisma } from '$lib/prisma'
// import { z } from 'zod'

export type LocationRouter = typeof locationRouter
export type LocationRouterInputs = inferRouterInputs<LocationRouter>
export type LocationRouterOutputs = inferRouterOutputs<LocationRouter>

export const locationRouter = router({

})
