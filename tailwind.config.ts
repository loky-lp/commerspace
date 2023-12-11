import { join } from 'path'
import type { Config } from 'tailwindcss'

import twForms from '@tailwindcss/forms'
import { type CustomThemeConfig, skeleton } from '@skeletonlabs/tw-plugin'

export const commerspace: CustomThemeConfig = {
	name: 'commerspace',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `'Roboto Condensed Variable', sans-serif`,
		'--theme-font-family-heading': `'Roboto Condensed Variable', sans-serif`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		// "--theme-font-color-base": "var(--color-surface-900)",
		// "--theme-font-color-dark": "var(--color-surface-50)",
		'--theme-rounded-base': '9999px',
		'--theme-rounded-container': '32px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '0 0 0',
		// "--on-secondary": "255 255 255",
		// "--on-tertiary": "0 0 0",
		// "--on-success": "0 0 0",
		// "--on-warning": "0 0 0",
		// "--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #55B785
		'--color-primary-50': '230 244 237', // #e6f4ed
		'--color-primary-100': '221 241 231', // #ddf1e7
		'--color-primary-200': '213 237 225', // #d5ede1
		'--color-primary-300': '187 226 206', // #bbe2ce
		'--color-primary-400': '136 205 170', // #88cdaa
		'--color-primary-500': '85 183 133', // #55B785
		'--color-primary-600': '77 165 120', // #4da578
		'--color-primary-700': '64 137 100', // #408964
		'--color-primary-800': '51 110 80', // #336e50
		'--color-primary-900': '42 90 65', // #2a5a41
		// secondary | #4F46E5
		// "--color-secondary-50": "229 227 251", // #e5e3fb
		// "--color-secondary-100": "220 218 250", // #dcdafa
		// "--color-secondary-200": "211 209 249", // #d3d1f9
		// "--color-secondary-300": "185 181 245", // #b9b5f5
		// "--color-secondary-400": "132 126 237", // #847eed
		// "--color-secondary-500": "79 70 229", // #4F46E5
		// "--color-secondary-600": "71 63 206", // #473fce
		// "--color-secondary-700": "59 53 172", // #3b35ac
		// "--color-secondary-800": "47 42 137", // #2f2a89
		// "--color-secondary-900": "39 34 112", // #272270
		// tertiary | #0EA5E9
		// "--color-tertiary-50": "219 242 252", // #dbf2fc
		// "--color-tertiary-100": "207 237 251", // #cfedfb
		// "--color-tertiary-200": "195 233 250", // #c3e9fa
		// "--color-tertiary-300": "159 219 246", // #9fdbf6
		// "--color-tertiary-400": "86 192 240", // #56c0f0
		// "--color-tertiary-500": "14 165 233", // #0EA5E9
		// "--color-tertiary-600": "13 149 210", // #0d95d2
		// "--color-tertiary-700": "11 124 175", // #0b7caf
		// "--color-tertiary-800": "8 99 140", // #08638c
		// "--color-tertiary-900": "7 81 114", // #075172
		// success | #84cc16
		// "--color-success-50": "237 247 220", // #edf7dc
		// "--color-success-100": "230 245 208", // #e6f5d0
		// "--color-success-200": "224 242 197", // #e0f2c5
		// "--color-success-300": "206 235 162", // #ceeba2
		// "--color-success-400": "169 219 92", // #a9db5c
		// "--color-success-500": "132 204 22", // #84cc16
		// "--color-success-600": "119 184 20", // #77b814
		// "--color-success-700": "99 153 17", // #639911
		// "--color-success-800": "79 122 13", // #4f7a0d
		// "--color-success-900": "65 100 11", // #41640b
		// warning | #EAB308
		// "--color-warning-50": "252 244 218", // #fcf4da
		// "--color-warning-100": "251 240 206", // #fbf0ce
		// "--color-warning-200": "250 236 193", // #faecc1
		// "--color-warning-300": "247 225 156", // #f7e19c
		// "--color-warning-400": "240 202 82", // #f0ca52
		// "--color-warning-500": "234 179 8", // #EAB308
		// "--color-warning-600": "211 161 7", // #d3a107
		// "--color-warning-700": "176 134 6", // #b08606
		// "--color-warning-800": "140 107 5", // #8c6b05
		// "--color-warning-900": "115 88 4", // #735804
		// error | #D41976
		// "--color-error-50": "249 221 234", // #f9ddea
		// "--color-error-100": "246 209 228", // #f6d1e4
		// "--color-error-200": "244 198 221", // #f4c6dd
		// "--color-error-300": "238 163 200", // #eea3c8
		// "--color-error-400": "225 94 159", // #e15e9f
		// "--color-error-500": "212 25 118", // #D41976
		// "--color-error-600": "191 23 106", // #bf176a
		// "--color-error-700": "159 19 89", // #9f1359
		// "--color-error-800": "127 15 71", // #7f0f47
		// "--color-error-900": "104 12 58", // #680c3a
		// surface | #525252
		"--color-surface-50": "229 229 229", // #e5e5e5
		"--color-surface-100": "220 220 220", // #dcdcdc
		"--color-surface-200": "212 212 212", // #d4d4d4
		"--color-surface-300": "186 186 186", // #bababa
		"--color-surface-400": "134 134 134", // #868686
		"--color-surface-500": "82 82 82", // #525252
		"--color-surface-600": "74 74 74", // #4a4a4a
		"--color-surface-700": "62 62 62", // #3e3e3e
		"--color-surface-800": "49 49 49", // #313131
		"--color-surface-900": "40 40 40", // #282828

		// Crimson placeholder while we define the commerspace theme
		'--on-secondary': '255 255 255',
		'--on-tertiary': '0 0 0',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '0 0 0',
		'--color-secondary-50': '227 237 243',
		'--color-secondary-100': '218 231 239',
		'--color-secondary-200': '209 225 235',
		'--color-secondary-300': '181 206 223',
		'--color-secondary-400': '126 170 199',
		'--color-secondary-500': '70 133 175',
		'--color-secondary-600': '63 120 158',
		'--color-secondary-700': '53 100 131',
		'--color-secondary-800': '42 80 105',
		'--color-secondary-900': '34 65 86',
		'--color-tertiary-50': '246 244 244',
		'--color-tertiary-100': '242 240 240',
		'--color-tertiary-200': '239 237 236',
		'--color-tertiary-300': '230 226 225',
		'--color-tertiary-400': '211 204 203',
		'--color-tertiary-500': '192 182 180',
		'--color-tertiary-600': '173 164 162',
		'--color-tertiary-700': '144 137 135',
		'--color-tertiary-800': '115 109 108',
		'--color-tertiary-900': '94 89 88',
		'--color-success-50': '246 250 239',
		'--color-success-100': '243 248 234',
		'--color-success-200': '240 247 229',
		'--color-success-300': '230 241 213',
		'--color-success-400': '212 231 182',
		'--color-success-500': '193 221 151',
		'--color-success-600': '174 199 136',
		'--color-success-700': '145 166 113',
		'--color-success-800': '116 133 91',
		'--color-success-900': '95 108 74',
		'--color-warning-50': '251 246 231',
		'--color-warning-100': '250 243 223',
		'--color-warning-200': '248 240 215',
		'--color-warning-300': '244 231 191',
		'--color-warning-400': '236 212 142',
		'--color-warning-500': '228 194 94',
		'--color-warning-600': '205 175 85',
		'--color-warning-700': '171 146 71',
		'--color-warning-800': '137 116 56',
		'--color-warning-900': '112 95 46',
		'--color-error-50': '248 236 236',
		'--color-error-100': '246 229 230',
		'--color-error-200': '244 223 224',
		'--color-error-300': '237 204 205',
		'--color-error-400': '224 165 167',
		'--color-error-500': '210 127 129',
		'--color-error-600': '189 114 116',
		'--color-error-700': '158 95 97',
		'--color-error-800': '126 76 77',
		'--color-error-900': '103 62 63',
	},
}

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
		twForms,
		skeleton({
			themes: {
				preset: [
					'crimson',
				],
				custom: [
					commerspace,
				],
			},
		}),
	],
} satisfies Config

export default config
