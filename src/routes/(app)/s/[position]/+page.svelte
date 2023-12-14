<script lang="ts">
	import { page } from '$app/stores'
</script>

<div>
	<pre><code>{JSON.stringify($page.data, null, 2)}</code></pre>
</div>