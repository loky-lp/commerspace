<script lang="ts">
	import { page } from '$app/stores'

	import { Button, FloatingLabelInput, Spinner } from 'flowbite-svelte'
	import { signIn } from '@auth/sveltekit/client'
	import ErrorBanner from '$lib/components/ErrorBanner.svelte'

	let loading: boolean
	let email: string
	let password: string

	async function handleSignIn() {
		loading = true
		try {
			// TODO Redirect to previous page
			await signIn('credentials', { email, password, callbackUrl: '' })
		} catch (e) {
			console.error(e)
		} finally {
			loading = false
		}
	}

</script>

<div class="max-w-screen-sm mx-auto grid gap-4 p-4">
	<h1>Sign in</h1>


	{#if $page.data.error}
		<ErrorBanner error={{ name: '', description: 'Credenziali non valide' }} />
	{/if}

	<form class="w-full grid gap-4" on:submit|preventDefault={handleSignIn}>
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

		<Button color={!loading ? 'primary' : 'alternative'} disabled={loading} on:click={handleSignIn}>
			{#if loading}
				<Spinner class="mr-3" size="4" color="white" />
			{/if}
			Accedi
		</Button>
	</form>
</div>
