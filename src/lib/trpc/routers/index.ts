import { router as r } from '$lib/trpc'

import { exampleRouter } from '$lib/trpc/routers/example'

export type Router = typeof router

export const router = r({
	example: exampleRouter,
})
