import {
	OrderPaymentStatus,
	OrderPaymentType,
	OrderStatus,
	OrderType,
	Prisma,
	PrismaClient,
	RateInterval,
	UserRole,
	UserStatus,
} from '@prisma/client'
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

function createFromKeys<K, T>(keyList: K[], factory: (key: K) => T): T[] {
	return Array.from(keyList, key => factory(key))
	// return keyList.map(key => factory(key))
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
			image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMUUxRTFFIi8+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8wXzEpIj4KPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRDlEOUQ5Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzEiIHI9IjIzIiBmaWxsPSIjOUM5QzlDIi8+CjxlbGxpcHNlIGN4PSI1MCIgY3k9IjEwMC41IiByeD0iNTAiIHJ5PSIzOC41IiBmaWxsPSIjOUM5QzlDIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMF8xIj4KPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==',
			role: UserRole.ADMIN,
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
			role: UserRole.HOST,
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
			role: UserRole.NONE,
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

	// // Create location's Service types
	//
	// startTime = performance.now()
	// process.stdout.write('  └─ Location\'s Service types  ')
	//
	// await prisma.service.upsert({
	// 	data: create(50, 50, () => ({})),
	// })
	//
	// console.log(printPerformanceDiff(startTime))

	// Create locations

	startTime = performance.now()
	process.stdout.write('  └─ Locations  ')

	const locations = await prisma.$transaction(
		create(300, 600, () => {
			const position = faker.location.city()
			const type = faker.commerce.department()
			return prisma.location.create({
				data: {
					user: {
						create: createUser(),
					},
					displayName: faker.company.name(),
					description: faker.lorem.text(),
					key: unique(faker.string.uuid),

					position: {
						connectOrCreate: {
							create: { id: position, createdAt: nextCreatedAt() },
							where: { id: position },
						},
					},
					address: faker.location.streetAddress({ useFullAddress: true }),

					photos: create(1, 20, faker.image.url),
					type: {
						connectOrCreate: {
							create: { id: type, createdAt: nextCreatedAt() },
							where: { id: type },
						},
					},

					rates: {
						createMany: {
							data: create(1, 3, () => ({
								quantity: faker.helpers.arrayElement([1, 2, 3] as const),
								interval: faker.helpers.enumValue(RateInterval),
								price: faker.number.int({ min: 200, max: 300000 }),
								createdAt: nextCreatedAt(),
							})),
						},
					},
					services: {
						// TODO: Create many locationsServices at once
						create: {
							service: {
								connectOrCreate: {
									create: {
										displayName: type,
										icon: 'lucide:' + faker.helpers.arrayElement(['shopping-cart', 'shirt', 'coffee', 'ear-off']),
										createdAt: nextCreatedAt(),
									},
									where: { displayName: type },
								},
							},
							createdAt: nextCreatedAt(),
						},
					},

					createdAt: nextCreatedAt(),
				},
				select: {
					id: true,
				},
			})
		}),
	)

	console.log(printPerformanceDiff(startTime))

	// Create locations geoData

	startTime = performance.now()
	process.stdout.write('  └─ Locations Geo data  ')
	// To create a LocationGeoData use the following snippet
	// await prisma.$queryRaw`INSERT INTO "LocationGeoData" (id, "lngLat") VALUES (${location.id}::UUID, ST_SetSRID(ST_MakePoint(${faker.location.longitude()}, ${faker.location.latitude()}), 3857)) RETURNING id, ST_X("lngLat") as lng, ST_Y("lngLat") as lat`

	await prisma.$transaction(
		createFromKeys(locations.map(location => location.id), (locationId) => {
			return prisma.$queryRaw`
				INSERT INTO "LocationGeoData" (id, "lngLat")
				VALUES (${locationId}::UUID,
								ST_SetSRID(ST_MakePoint(${faker.location.longitude()}, ${faker.location.latitude()}), 3857)) RETURNING id, ST_X("lngLat") as lng, ST_Y("lngLat") as lat`
		}),
	)

	console.log(printPerformanceDiff(startTime))

	// Create orders and reservations

	startTime = performance.now()
	process.stdout.write('  └─ Orders and Reservations  ')

	const users = (await prisma.user.findMany({ select: { id: true } })).map(({ id }) => id)
	const locationIds = locations.map(({ id }) => id)

	await prisma.$transaction(
		create(300, 600, () =>
			prisma.order.create({
				data: {
					user: {
						connect: { id: faker.helpers.arrayElement(users) },
					},

					name: faker.lorem.sentence(5),

					type: faker.helpers.enumValue(OrderType),
					status: faker.helpers.enumValue(OrderStatus),
					paymentType: faker.helpers.enumValue(OrderPaymentType),
					paymentStatus: faker.helpers.enumValue(OrderPaymentStatus),

					// Connected reservation
					reservation: {
						create: {
							location: {
								connect: { id: faker.helpers.arrayElement(locationIds) },
							},
							user: {
								connect: { id: faker.helpers.arrayElement(users) },
							},

							checkIn: faker.date.past({ years: 1 }),
							checkOut: faker.date.future({ years: 1 }),
						},
					},

					createdAt: nextCreatedAt(),
				},
			}),
		),
	)

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
