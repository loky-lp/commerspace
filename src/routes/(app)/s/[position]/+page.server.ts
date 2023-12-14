import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ fetch, url, params: { position } }) => {
	// Check if position is a valid position, if not, return 404

	// Call trpc to get the data for the position

	// Pass url.searchParams to trpc to filter the data

	return {
		locations: [
			{
				id: '1234567890',
				type: 'Coworking',
				name: 'Titolo Annuncio',
				address: 'Via Roma 1, 20100 Milano',
				images: [
					{
						id: '1234567890',
						url: 'https://picsum.photos/seed/picsum/200/300',
						alt: 'Titolo Immagine',
					},
				],
				rates: [
					{
						id: '1234567890',
						price: 20,
						quantity: 1,
						interval: 'DAY',
					},
					{
						id: '1234567890',
						price: 120,
						quantity: 1,
						interval: 'WEEK',
					},
				],
				services: [],
				// if the user is logged in, show the following fields
				favorite: true,
			},
			{
				id: '1234567890',
				type: 'Sala Eventi',
				name: 'Titolo Annuncio',
				address: 'Via Rodolfo Lanciani 10, Roma',
				images: [
					{
						id: '1234567890',
						url: 'https://picsum.photos/seed/picsum/200/300',
						alt: 'Titolo Immagine',
					},
				],
				rates: [
					{
						id: '1234567890',
						price: 20,
						quantity: 1,
						interval: 'DAY',
					},
					{
						id: '1234567890',
						price: 120,
						quantity: 1,
						interval: 'WEEK',
					},
				],
				services: [],
				// if the user is logged in, show the following fields
				favorite: true,
			},
		],
	}
}

