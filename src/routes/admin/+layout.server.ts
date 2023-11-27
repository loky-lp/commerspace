import { UserRole } from '@prisma/client'

import type { LayoutServerLoad } from './$types'

import { redirect } from '@sveltejs/kit'

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession()

	if (!session?.user)
		throw redirect(307, 'signin') // TODO Add redirect

	// TODO redirect with error explanation or shadow
	if (session.user.role != UserRole.ADMIN)
		throw redirect(307, '/')

	// TODO Check user acl on a per-route level
	return {
		session,
	}
}