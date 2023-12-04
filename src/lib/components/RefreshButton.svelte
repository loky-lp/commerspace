<script lang="ts">
	import type { Readable } from 'svelte/store'
	import { RefreshCw } from 'lucide-svelte'

	export let loading: Readable<boolean>
	export let refresh: () => void
</script>

<button class="btn-icon btn-icon-sm bg-surface-hover-token" disabled={$loading} on:click={refresh}>
	<span class:animate-spin={$loading}>
		<RefreshCw />
	</span>
</button>