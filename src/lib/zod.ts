import type { ZodTypeAny } from 'zod'
import { preprocess } from 'zod'

/**
 * Replace white and newline with a single space, consecutive white-space will be converted into a single space.
 *
 * ### Note
 * The string is not trimmed.
 */
export function singleLine<I extends ZodTypeAny>(schema: I) {
	return preprocess((u: unknown) => (typeof u === 'string' ? u.replace(/\s+/g, ' ') : u), schema)
}

/**
 * Normalize newlines, remove any `\r`.
 *
 * ### Note
 * The string is not trimmed.
 */
export function text<I extends ZodTypeAny>(schema: I) {
	return preprocess((u: unknown) => (typeof u === 'string' ? u.replace(/\r?\n/g, '\n') : u), schema)
}