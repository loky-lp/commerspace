import type { DefaultSession } from '@auth/core/types'
import type { UserRole } from '$lib/prisma'

export declare module '@auth/core/types' { // This is tested with pnpm
	interface Session {
		user: {
			id: string
			role: UserRole
		} & DefaultSession['user']
	}
}