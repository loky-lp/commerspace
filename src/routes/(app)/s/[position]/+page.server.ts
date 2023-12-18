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
					{
						id: '7',
						price: 120,
						quantity: 1,
						interval: 'YEAR',
					},
					{
						id: '8',
						price: 120,
						quantity: 2,
						interval: 'YEAR',
					},
				],
				services: [
					{ id: '1', name: 'Wi-Fi' },
					{ id: '2', name: 'Caffè' },
				],
				// if the user is logged in, show the following fields
				favorite: true,
			},
			{
				id: '0987654321',
				type: 'Sala Eventi',
				name: 'Titolo Annuncio',
				address: 'Via Rodolfo Lanciani 10, Roma',
				images: [
					{
						id: '1234567890',
						url: 'https://picsum.photos/seed/picsum/500/500',
						alt: 'Titolo Immagine',
					},
				],
				rates: [
					{
						id: '11',
						price: 20,
						quantity: 1,
						interval: 'DAY',
					},
					{
						id: '12',
						price: 120,
						quantity: 1,
						interval: 'WEEK',
					},
				],
				services: [
					{ id: '1', name: 'Wi-Fi' },
				],
				// if the user is logged in, show the following fields
				favorite: true,
			},
		],
	}
}

