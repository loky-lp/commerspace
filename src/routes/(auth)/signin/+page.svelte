<script lang="ts">
	import { page } from '$app/stores'

	import { ErrorBanner, Spinner } from '$lib/components'
	import { signIn } from '@auth/sveltekit/client'

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

<div class="w-screen h-screen flex flex-col">
	<div class="self-end p-2 sm:p-4">
		Non hai ancora un account? <a href="/signup" class="font-semibold">Registrati</a>
	</div>
	<div class="flex-1 flex items-center justify-center">
		<div
			class="w-[clamp(0px,50ch,100vw)] sm:w-[clamp(50ch,70ch,100vw)] mx-auto grid gap-4 p-4 card border-surface-300-600-token"
		>
			<!-- TODO Refine to use Skeleton style guides-->
			<h1 class="text-2xl font-semibold">Benvenuto su commerspace</h1>

			{#if $page.data.error}
				<ErrorBanner error={{ name: '', description: 'Credenziali non valide' }} />
			{/if}

			<form class="w-full grid gap-4" on:submit|preventDefault={handleSignIn}>
				<input required type="email" name="email" id="email-input" placeholder="Email" bind:value={email}
				       class="input"
				>
				<input required type="password" name="password" id="password-input" placeholder="Password" bind:value={password}
				       class="input"
				>

				<!-- Inserted only to allow submit from keyboard -->
				<input class="hidden" type="submit">

				<button disabled={loading} type="submit"
				        class="btn variant-filled-primary"
				        class:variant-ghost-primary={loading}
				>
					{#if loading}
						<Spinner class="mr-3" />
					{/if}
					Accedi
				</button>
			</form>

			<div>TODO Socials</div>
		</div>
	</div>
</div>
