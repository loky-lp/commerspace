<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton'

	export let width = 'w-8'
</script>

<ProgressRadial
	value={undefined}
	{width}
	class={$$props.class ?? ''}
	meter="stroke-primary-500"
	track="stroke-primary-500/30"
/>
