import type { PageServerLoad } from './$types'
import { trpc } from '$lib/trpc/client'

export const load: PageServerLoad = async ({ fetch, url }) => {
	return {
		categories: await trpc({ fetch, url }).category.getAll.query({}),
	}
}
