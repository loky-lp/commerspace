import { router as r } from '$lib/trpc'

import { authRouter } from '$lib/trpc/routers/auth'
import { exampleRouter } from '$lib/trpc/routers/example'

export type Router = typeof router

export const router = r({
	auth: authRouter,
	example: exampleRouter,
})
