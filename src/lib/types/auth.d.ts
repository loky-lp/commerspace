import type { DefaultSession } from '@auth/core/types'
import type { UserRole } from '@prisma/client'

export declare module '@auth/core/types' { // This is tested with pnpm
	interface Session {
		user: {
			id: string
			role: UserRole
		} & DefaultSession['user']
	}
}