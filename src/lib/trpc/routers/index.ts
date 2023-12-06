import { router as r } from '$lib/trpc'

import { authRouter } from '$lib/trpc/routers/auth'
import { exampleRouter } from '$lib/trpc/routers/example'
import { locationRouter } from '$lib/trpc/routers/location'
import { userRouter } from '$lib/trpc/routers/user'

export type Router = typeof router

export const router = r({
	auth: authRouter,
	example: exampleRouter,
	location: locationRouter,
	user: userRouter
})
