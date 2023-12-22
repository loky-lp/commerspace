import type { PageServerLoad } from './$types'
import { trpc } from '$lib/trpc/client'

export const load: PageServerLoad = async ({ fetch, url, params: { position } }) => {
	// Check if position is a valid position, if not, return 404

	// Call trpc to get the data for the position

	// Pass url.searchParams to trpc to filter the data

	return {
		categories: await trpc({ fetch, url }).category.getAll.query({}),
		// TODO: Pass queryParameters
		locations: await trpc({ fetch, url }).location.search.query({ position }),
	}
}

