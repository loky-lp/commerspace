import type { PageServerLoad } from './$types'
// import { trpc } from '$lib/trpc/client'

export const load: PageServerLoad = async (/*{ fetch, url, params: { id } }*/) => {
	return {
		// location: await trpc({ fetch, url }).location.get.query({ id }),
		location: {
			id: '1234567890',
			type: 'Coworking',
			name: 'Titolo Annuncio',
			address: 'Via Roma 1, 20100 Milano',
			images: [
				{
					id: '1234567890',
					url: 'https://picsum.photos/seed/picsum/500/500',
					alt: 'Titolo Immagine',
				},
			],
			rates: [
				{
					id: '1',
					price: 20,
					quantity: 1,
					interval: 'DAY',
				},
				{
					id: '2',
					price: 20,
					quantity: 2,
					interval: 'DAY',
				},
				{
					id: '3',
					price: 120,
					quantity: 1,
					interval: 'WEEK',
				},
				{
					id: '4',
					price: 120,
					quantity: 2,
					interval: 'WEEK',
				},
				{
					id: '5',
					price: 120,
					quantity: 1,
					interval: 'MONTH',
				},
				{
					id: '6',
					price: 120,
					quantity: 2,
					interval: 'MONTH',
				},
			],
		},
	}
}
