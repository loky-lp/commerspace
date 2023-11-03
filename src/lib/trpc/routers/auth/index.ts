import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { publicProcedure, router } from '$lib/trpc'
import { createPasswordHash, zCredentials } from '$lib/auth'
import { prisma } from '$lib/prisma'

export type AuthRouter = typeof authRouter
export type AuthRouterInputs = inferRouterInputs<AuthRouter>
export type AuthRouterOutputs = inferRouterOutputs<AuthRouter>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getIp() {
	return '' // TODO: Unimplemented
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getUserAgent() {
	return '' // TODO: Unimplemented
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isEmailFake(email: string) {
	return false // TODO: Unimplemented
}

export const authRouter = router({
	register: publicProcedure
		.input(
			zCredentials,
		)
		.mutation(async ({ input: { email, password } }) => {
			console.log('REGISTRATION', { email, password })

			if (isEmailFake(email)) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Bad email provider',
				})
			}

			const passwordHash = await createPasswordHash(password)

			// TODO: generate a validation token
			// The token, the ip and user agent are used for the email verification
			// const ip = getIp()
			// const userAgent = getUserAgent()

			const user = await prisma.user.create({
				data: {
					email,
					firstName: 'Utente',
					lastName: 'Anonimo',
					credentials: {
						create: {
							password: passwordHash,
						},
					},
					// TODO Creare email validation entry
				},
			})
				.catch(() => {
					// TODO: Check for unique Constraint
					return null
				})

			// do not tip off the user already exists
			if (!user) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Invalid Credentials',
				})
			}

			// TODO: Send validation email
		}),
})

