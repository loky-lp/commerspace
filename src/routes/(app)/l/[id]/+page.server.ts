import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { trpc } from '$lib/trpc/client'

export const load: PageServerLoad = async ({ fetch, url, params: { id } }) => {
	try {
		return {
			location: await trpc({ fetch, url }).location.get.query({ id }),
		}
	} catch (e: unknown) {
		throw error(404, 'Location not found')
	}
}
