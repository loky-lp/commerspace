import { PrismaClient } from '@prisma/client'
import { createPasswordHash } from './lib'

const prisma = new PrismaClient()

async function seed() {
	console.log('🌱  Seeding...')

	await prisma.user.create({
		data: {
			firstName: 'Test',
			lastName: 'Account',
			email: 'admin@commerspace.com',
			credentials: {
				create: {
					password: await createPasswordHash('123456'),
				},
			},
		},
	})
}

seed()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
