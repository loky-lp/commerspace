import type { PageServerLoad } from './$types'
import { trpc } from '$lib/trpc/client'
import { error } from '@sveltejs/kit'
import { isTRPCClientError } from '$lib/utils/error'

export const load: PageServerLoad = async ({ fetch, url, params: { position } }) => {
	try {
		return {
			categories: await trpc({ fetch, url }).category.getAll.query({}),
			// TODO: Pass queryParameters
			locations: await trpc({ fetch, url }).location.search.query({ position }),
		}
	} catch (e: unknown) {
		if (isTRPCClientError(e) && e.data?.code === 'NOT_FOUND') {
			throw error(404, 'invalid position')
		}

		throw error(500, 'Error fetching locations')
	}
}

