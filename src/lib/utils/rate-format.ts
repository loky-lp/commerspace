import type { LocationRate } from '$lib/prisma'

// Prisma shows itself as 💩 when it comes to do something more than a simple query.
// I was trying to map the data using directly enum values, but Prisma won't export any code that reaches the user.
// The following is an extremely error-prone workaround to map the enum values to a string,
// keep an eye if the rate interval model changes.

const intervalMap = {
	['DAY']: 'giorno',
	['WEEK']: 'settimana',
	['MONTH']: 'mese',
	['YEAR']: 'anno',
}

const intervalPluralMap = {
	['DAY']: 'giorni',
	['WEEK']: 'settimane',
	['MONTH']: 'mesi',
	['YEAR']: 'anni',
}

// HACK: Hardcoded locale and currency
const nf = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' })

export function rateFormat({ price, interval, quantity }: LocationRate) {
	const displayPrice = nf.format(price / 100)
	// HACK: The platform only supports one currency, the moment we need to support more currencies, we need to change this
	if (quantity === 1)
		return `${displayPrice} /${intervalMap[interval]}`

	return `${displayPrice} / ${quantity} ${intervalPluralMap[interval]}`
}