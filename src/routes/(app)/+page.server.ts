import type { PageServerLoad } from './$types'
import { trpc } from '$lib/trpc/client'

export const load: PageServerLoad = async ({ fetch, url }) => {
	return {
		heroWords: ['Ufficio', 'Salone eventi', 'Coworking'],
		categories: await trpc({ fetch, url }).category.getAll.query({}),
		positions: await trpc({ fetch, url }).position.getAll.query({}),
		showcase: [
			{
				href: '#TODO',
				displayName: 'Sale per eventi',
				imgUrl: 'https://images.unsplash.com/photo-1604999565976-8913ad2ddb7c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80',
			},
			{
				href: '#TODO',
				displayName: 'Uffici privati',
				imgUrl: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80',
			},
			{
				href: '#TODO',
				displayName: 'Temporary Store',
				imgUrl: 'https://images.unsplash.com/photo-1622890806166-111d7f6c7c97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&h=160&q=80',
			},
		],
	}
}
