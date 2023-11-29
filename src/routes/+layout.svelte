<script>
	import '@fontsource-variable/roboto-condensed'
	import '../app.css'
	import { signOut } from '@auth/sveltekit/client'

	function handleSignOut() {
		signOut()
	}
</script>

<nav>
	<a href="/signin">signIn</a>
	<a href="/signup">signUp</a>
	<button on:click={handleSignOut}>signOut</button>
</nav>
<slot />
