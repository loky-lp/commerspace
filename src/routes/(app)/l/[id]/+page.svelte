<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<pre><code>{JSON.stringify(data.location, null, 2)}</code></pre>
