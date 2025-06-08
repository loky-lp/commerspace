# Commerspace

This was a project commissioned by a third party.
The goal was to create a platform that would have been the "Airbnb" for businesses.

But the client vanished during the development, taking away the payments too.

Now this is an old project, with vulnerable dependencies and bad implementations,
so for what it's worth can be shared publicly.


## Technical considerations

The project was built using:
- `svelte@4` and `@svelte/kit@2` because they are awesome XD
- `@auth/core` as the auth library, but I wouldn't pick it again, I'd rather implement the auth myself or use a third party like [Auth0](https://auth0.com/) or [Clerk](https://clerk.com/)
- `trpc@10` for the server side logic, but I'd pick sveltekit native form actions
- `prisma@5` as the ORM, but I would pick [drizzle](https://orm.drizzle.team/) now
- `@skeletonlabs/skeleton@2` as the UI library, it was fine, but sometimes I needed to hack it. I'd consider it again if I'm unable to use [bits-ui](https://www.bits-ui.com/)

As you can see, I have a lot of considerations on the tech choices. It was a fun project where I could experiment.