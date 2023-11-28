<script lang="ts">
	import { getLeftMenuOpen } from '$lib/context'
	import type { MouseEventHandler } from 'svelte/elements'

	export let text: string
	export let click: string | MouseEventHandler<HTMLButtonElement>

	const isOpen = getLeftMenuOpen()
</script>

<li >
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<svelte:element
		this={typeof click === 'string' ? 'a' : 'button'}
		href={typeof click === 'string' ? click : null}
		on:click={typeof click === 'string' ? null : click}
		class="w-full p-2 hover:bg-neutral-200 transition-colors rounded-xl flex justify-start items-center gap-2"
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
