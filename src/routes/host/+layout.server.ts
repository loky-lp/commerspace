import type { LayoutServerLoad } from './$types'

import { redirect } from '@sveltejs/kit'

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession()

	console.log('role', session?.user?.role)
	if (!session?.user)
		throw redirect(307, 'signin')


	// redirect with error explanation
	if (session.user.role == 'NONE')
		throw redirect(307, '/')

	return {
		session,
	}
}