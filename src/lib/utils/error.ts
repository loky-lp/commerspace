import { TRPCClientError } from '@trpc/client'
import type { Router } from '$lib/trpc/routers'

export function isError(error: unknown): error is Error {
	return !!(error && typeof error === 'object' && error instanceof Error)
}

export function isTRPCClientError(error: unknown): error is TRPCClientError<Router> {
	return !!(error && typeof error === 'object' && error instanceof TRPCClientError)
}

export type ErrorInfo = {
	name: string
	description: string
}

// const tRPCErrorNameMap: Record<string, string> = {
// 	'BAD_REQUEST': '',
// 	'INTERNAL_SERVER_ERROR': '',
// 	'NOT_IMPLEMENTED': '',
// 	'UNAUTHORIZED': '',
// 	'FORBIDDEN': '',
// 	'NOT_FOUND': '',
// } as const
//
// const tRPCErrorDescriptionMap: Record<string, string> = {
// 	'BAD_REQUEST': '',
// 	'INTERNAL_SERVER_ERROR': '',
// 	'NOT_IMPLEMENTED': '',
// 	'UNAUTHORIZED': '',
// 	'FORBIDDEN': '',
// 	'NOT_FOUND': '',
// } as const

export function getErrorInfo(error: Error | TRPCClientError<Router> | ErrorInfo): ErrorInfo {
	// TODO: Decide whether to show or not error information to the user
	if ('name' in error && 'description' in error) {
		return error
	} else if (isTRPCClientError(error)) {
		return {
			name: error.data?.code ?? '', // tRPCErrorNameMap[error.data?.code ?? ''] ?? '',
			description: `${error.name}: ${error.data?.code} on ${error.data?.path}`,
		}
	} else if (isError(error)) {
		return {
			name: error.name,
			description: error.message,
		}
	} else {
		return {
			name: 'non definito',
			description: 'Qualcosa è andato storto',
		}
	}
}
