<script lang="ts">
	import type { TRPCClientError } from '@trpc/client'
	import type { Router } from '$lib/trpc/routers'

	import { ExclamationCircleOutline } from 'flowbite-svelte-icons'
	import { getErrorInfo, } from '$lib/utils/error'

	export let error: Error | TRPCClientError<Router>
	$: info = getErrorInfo(error)
</script>

<div class="bg-red-500/25 rounded-xl border-2 border-red-500 p-2">
	<h2 class="font-semibold text-xl flex items-center gap-2">
		<ExclamationCircleOutline />
		Errore {info.name}
	</h2>
	<p>{info.description}</p>
<!--	<pre><code>{JSON.stringify(error, null, 2)}</code></pre>-->
</div>