import { Prisma, PrismaClient, UserRole, UserStatus } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { createPasswordHash } from './lib'

function printPerformanceDiff(startTime: number) {
	return `${Math.round(performance.now() - startTime)}ms`
}

function rand(min: number, max: number) {
	return Math.floor(Math.random() * (max - min)) + min
}

function create<T>(min: number, max: number, factory: () => T): T[] {
	return Array.from({ length: rand(min, max) }, () => factory())
}

function createWithIndex<T>(min: number, max: number, factory: (index: number) => T): T[] {
	return Array.from({ length: rand(min, max) }, (_, index) => factory(index))
}

let __createdAt = new Date(Date.now() - 7 * 24 * 3600 * 1000) // 7 * 24 h

function nextCreatedAt() {
	// increment the date by 1 sec
	__createdAt = new Date(__createdAt.getTime() + 1000)

	return __createdAt
}

const uniqueStringSet = new Set<string>()

function unique(factory: () => string): string {
	let value: string

	do {
		value = factory()
	}
	while (uniqueStringSet.has(value))

	uniqueStringSet.add(value)
	return value
}

function uniqueLowercaseEmail(): string {
	return unique(() => {
		return faker.internet.email().toLowerCase()
	})
}

function createUser(data?: Partial<Prisma.UserCreateArgs['data']>) {
	return Prisma.validator<Prisma.UserCreateInput>()({
		email: uniqueLowercaseEmail(),
		emailVerifiedAt: null,
		// image: faker.image.urlLoremFlickr({ category: 'person', width: 480, height: 480 }),
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		// phone
		// phoneVerifiedAt
		// documentVerifiedAt
		role: UserRole.NONE,
		status: UserStatus.NONE,

		createdAt: nextCreatedAt(),
		...data,
	})
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
	process.stdout.write('  └─ Random users  ')

	await prisma.user.createMany({
		data: create(100, 100, createUser),
	})

	console.log(printPerformanceDiff(startTime))
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
