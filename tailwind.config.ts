import { join } from 'path'
import type { Config } from 'tailwindcss'

import flowbite from 'flowbite/plugin'
import { skeleton } from '@skeletonlabs/tw-plugin'

const config = {
	// darkMode: 'class' allows Skeleton themes to work
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// Flowbite package
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}',
		// Skeleton package
		join(
			require.resolve('@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}',
		),
	],

	theme: {
		extend: {
			fontFamily: {
				'roboto-condensed': '"Roboto Condensed Variable", sans-serif',
			},
		},
	},

	plugins: [
		flowbite,
		skeleton({
			themes: { preset: ['crimson'] },
		}),
	],
} satisfies Config

export default config
