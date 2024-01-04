import type { PageServerLoad } from './$types'
import type { LocationRouterInputs } from '$lib/trpc/routers/location'
import { trpc } from '$lib/trpc/client'
import { error } from '@sveltejs/kit'
import { isTRPCClientError } from '$lib/utils/error'

export const load: PageServerLoad = async ({ fetch, url, params: { position } }) => {
	const searchParams = Object.fromEntries(url.searchParams) as unknown as Omit<LocationRouterInputs['search'], 'position'>

	try {
		return {
			categories: await trpc({ fetch, url }).category.getAll.query({}),
			positions: await trpc({ fetch, url }).position.getAll.query({}),
			locations: await trpc({ fetch, url }).location.search.query({ position, ...searchParams }),
		}
	} catch (e: unknown) {
		if (isTRPCClientError(e) && e.data?.code === 'NOT_FOUND') {
			error(404, 'invalid position')
		}

		error(500, 'Error fetching locations')
	}
}

