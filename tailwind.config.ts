import { join } from 'path'
import type { Config } from 'tailwindcss'

import { skeleton } from '@skeletonlabs/tw-plugin'

const config = {
	// darkMode: 'class' allows Skeleton themes to work
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
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
		skeleton({
			themes: { preset: ['crimson'] },
		}),
	],
} satisfies Config

export default config
