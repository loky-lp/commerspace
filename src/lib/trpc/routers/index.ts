import { router as r } from '$lib/trpc'

import { authRouter } from '$lib/trpc/routers/auth'
import { categoryRouter } from '$lib/trpc/routers/category'
import { exampleRouter } from '$lib/trpc/routers/example'
import { locationRouter } from '$lib/trpc/routers/location'
import { userRouter } from '$lib/trpc/routers/user'

export type Router = typeof router

export const router = r({
	auth: authRouter,
	category: categoryRouter,
	example: exampleRouter,
	location: locationRouter,
	user: userRouter,
})
