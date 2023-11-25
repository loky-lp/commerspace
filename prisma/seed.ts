import { PrismaClient } from '@prisma/client'
import { createPasswordHash } from './lib'

function printPerformanceDiff(startTime: number) {
	return `${Math.round(performance.now() - startTime)}ms`
}

const prisma = new PrismaClient()

async function seed() {
	console.log('🌱  Seeding...')

	// Create the admin user

	let startTime = performance.now()
	process.stdout.write('  └─ Example users  ')

	await prisma.user.create({
		data: {
			firstName: 'Admin',
			lastName: 'Account',
			email: 'admin@commerspace.com',
			role: 'ADMIN',
			credentials: {
				create: {
					password: await createPasswordHash('123456'),
				},
			},
		},
	})
	await prisma.user.create({
		data: {
			firstName: 'Host',
			lastName: 'Account',
			email: 'host@commerspace.com',
			role: 'HOST',
			credentials: {
				create: {
					password: await createPasswordHash('123456'),
				},
			},
		},
	})
	await prisma.user.create({
		data: {
			firstName: 'User',
			lastName: 'Account',
			email: 'user@commerspace.com',
			role: 'NONE',
			credentials: {
				create: {
					password: await createPasswordHash('123456'),
				},
			},
		},
	})

	console.log(printPerformanceDiff(startTime))

	// Create generated users

	startTime = performance.now()
	process.stdout.write('  └─ Generated users ... TODO')


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
