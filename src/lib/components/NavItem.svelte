<script lang="ts">
	import { getLeftMenuOpen } from '$lib/context'
	import type { MouseEventHandler } from 'svelte/elements'

	export let text: string
	export let click: string | MouseEventHandler<HTMLButtonElement>

	const isOpen = getLeftMenuOpen()
</script>

<li>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<svelte:element
		class="w-full btn bg-surface-hover-token justify-start gap-2 px-2"
		href={typeof click === 'string' ? click : null}
		on:click={typeof click === 'string' ? null : click}
		this={typeof click === 'string' ? 'a' : 'button'}
	>
		<slot name="icon">
			<!-- Text placeholder if icon is absent -->
			{#if !$$slots.icon && !$isOpen}
			<span class="inline-block w-6 h-6 truncate">
				{text}
			</span>
			{/if}
		</slot>
		{#if $isOpen}
			{text}
		{/if}
	</svelte:element>
</li>
