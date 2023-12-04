<script lang="ts">
	import { page } from '$app/stores'
	import { trpc } from '$lib/trpc/client'
	import { isTRPCClientError } from '$lib/utils/error'

	import { Button, FloatingLabelInput, Hr, Spinner } from 'flowbite-svelte'
	import { AppleSolid, FacebookSolid, GoogleSolid } from 'flowbite-svelte-icons'
	import { signIn } from '@auth/sveltekit/client'
	import { ErrorBanner } from '$lib/components'

	let loading: boolean
	let error: { code: string, message: string } | undefined

	let email: string
	let password: string

	async function handleSignUp() {
		error = undefined
		loading = true
		try {
			// Create user with trpc
			await trpc($page).auth.register.mutate({ email, password })

			// manually signIn
			// TODO Redirect to onboarding page or previous page
			await signIn('credentials', { email, password, callbackUrl: '' })
		} catch (e: unknown) {
			if (isTRPCClientError(e))
				error = { code: e.data?.code ?? '', message: e.message }
		} finally {
			loading = false
		}
	}

</script>

<div class="w-screen h-screen flex flex-col">
	<div class="self-end p-2 sm:p-4">
		Hai già un account? <a href="/signin" class="font-semibold">Accedi</a>
	</div>
	<div class="flex-1 flex items-center justify-center">
		<div class="w-[clamp(0px,50ch,100vw)] sm:w-[clamp(50ch,70ch,100vw)] mx-auto grid gap-4 p-4 border rounded-xl">
			<h1>Benvenuto su commerspace</h1>

			{#if error && error.code === 'BAD_REQUEST' && error.message === 'Invalid Credentials'}
				<ErrorBanner error={{ name: '', description: 'Credenziali non valide' }} />
			{/if}

			<form class="w-full grid gap-4" on:submit|preventDefault={handleSignUp}>
				<FloatingLabelInput bind:value={email} id="email-input" name="email"
				                    required style="outlined" type="email"
				>
					Email
				</FloatingLabelInput>
				<FloatingLabelInput bind:value={password} id="password-input" name="password"
				                    required style="outlined" type="password"
				>
					Password
				</FloatingLabelInput>

				<!-- Inserted only to allow submit from keyboard -->
				<input class="hidden" type="submit">

				<Button color={!loading ? 'primary' : 'alternative'} disabled={loading} on:click={handleSignUp} size="lg">
					{#if loading}
						<Spinner class="mr-3" size="4" color="white" />
					{/if}
					Accedi
				</Button>
			</form>

			<Hr hrClass="my-2 w-full" textSpanClass="font-light">
				oppure
			</Hr>

			<Button color="alternative">Accedi con <GoogleSolid class="ml-2"/></Button>
			<Button color="alternative" class="border-blue-500">Accedi con <FacebookSolid class="ml-2"/></Button>
			<Button color="alternative" class="border-neutral-800">Accedi con <AppleSolid class="ml-2"/></Button>
		</div>
	</div>
</div>
