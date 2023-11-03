<script lang="ts">
	import { page } from '$app/stores'
	import { trpc } from '$lib/trpc/client'

	import { FloatingLabelInput } from 'flowbite-svelte'
	import { signIn } from '@auth/sveltekit/client'

	let email: string
	let password: string

	async function handleSignUp() {
		try {
			// TODO: Refine UX
			// Create user with trpc
			await trpc($page).auth.register.mutate({ email, password })

			// manually signIn
			await signIn('credentials', { email, password, callbackUrl: '' })
		} catch (e) {
			console.error(e)
		}
	}

</script>

<div class="max-w-screen-sm mx-auto">
	<h1>Sign up</h1>

	<form class="max-w-screen-sm mx-auto" on:submit={handleSignUp}>
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
		<input type="submit" value="TODO">
	</form>
</div>
