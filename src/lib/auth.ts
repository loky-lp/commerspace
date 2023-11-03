import { promisify } from 'node:util'
import { randomBytes } from 'node:crypto'

import type { Handle } from '@sveltejs/kit'
import { SvelteKitAuth } from '@auth/sveltekit'
// import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from '@auth/core/providers/credentials'
import { hash as makeHash, verify as verifyHash } from 'argon2'
import { z } from 'zod'

import { prisma } from '$lib/prisma'

export type HashedPassword = string

export async function createPasswordHash(plainValue: string): Promise<HashedPassword> {
	const salt = await promisify(randomBytes)(32)
	return await makeHash(plainValue, { salt })
}

export async function checkPasswordHash(plainValue: string, hashedPassword: HashedPassword): Promise<boolean> {
	try {
		return await verifyHash(hashedPassword, plainValue)
	} catch {
		// Pass
	}

	return false
}

export const zEmail = z.string().trim().toLowerCase().email().max(255) // TODO: Share code
export const zPassword = z.string().min(6).max(255) // TODO: Share code
export const zCredentials = z.object({
	email: zEmail,
	password: zPassword,
})

// TODO: Move to handler section with the trpc one
export const authHandle = SvelteKitAuth({
	// adapter: PrismaAdapter(prisma),
	pages: {
		signIn: '/signin',
		// error: '',
	},
	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email', datatype: 'string' },
				password: { label: 'Password', type: 'password', datatype: 'string' },
			},
			async authorize(credentials) {
				console.log('credentials', credentials)

				const zodParse = zCredentials.safeParse(credentials)
				if (!zodParse.success) return null
				const { email, password } = zodParse.data

				const user = await prisma.user.findUnique({
					where: {
						email: email,
					},
					include: {
						credentials: true,
					},
				})

				if (!user || !user.credentials) return null

				const loginAttempt = await checkPasswordHash(password, user.credentials.password)

				if (!loginAttempt)
					return null

				console.log('user', user)

				return user
			},
		}),
	],
}) satisfies Handle
