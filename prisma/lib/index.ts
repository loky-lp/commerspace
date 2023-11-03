import { promisify } from 'node:util'
import { randomBytes } from 'node:crypto'

import { hash as makeHash, verify as verifyHash } from 'argon2'

export type HashedPassword = string

export async function createPasswordHash(plainValue: string): Promise<HashedPassword> {
	const salt = await promisify(randomBytes)(32)
	return await makeHash(plainValue, { salt })
}

export async function checkPasswordHash(plainValue: string, hashedPassword: HashedPassword): Promise<boolean> {
	try {
		return await verifyHash(hashedPassword, plainValue)
	} catch {
		// Pass
	}

	return false
}
