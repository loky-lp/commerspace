<script lang="ts">
	import { page } from '$app/stores'
	import { trpc } from '$lib/trpc/client'
	import { isTRPCClientError } from '$lib/utils/error'

	import { Button, FloatingLabelInput, Spinner } from 'flowbite-svelte'
	import { signIn } from '@auth/sveltekit/client'
	import ErrorBanner from '$lib/components/ErrorBanner.svelte'

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

<div class="max-w-screen-sm mx-auto grid gap-4 p-4">
	<h1>Sign up</h1>

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

		<Button color={!loading ? 'primary' : 'alternative'} disabled={loading} on:click={handleSignUp}>
			{#if loading}
				<Spinner class="mr-3" size="4" color="white" />
			{/if}
			Accedi
		</Button>
	</form>
</div>
