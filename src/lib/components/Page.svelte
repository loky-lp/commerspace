<script lang="ts">
	import { goBack } from '$lib/navigation'
	import { ArrowLeft } from 'lucide-svelte'

	/**
	 * The subtitle shown after the `title` slot
	 */
	export let subtitle: string | undefined = undefined
	/**
	 * The action that needs to be performed when the button is clicked.
	 *
	 * When true, it defaults to send the user back one route.
	 * When it's a function, the latter will be executed.
	 * When it's false or undefined, the button won't be shown.
	 *
	 * This is a prop and not a dispatched event because we have to check if it's defined or not.
	 */
	export let onBack: boolean | (() => void) | undefined = undefined

	// TODO: Uniform utilization of svelte:fragment
</script>

{#if $$slots.header}
	<div class="mb-4">
		<slot name="header" />
	</div>
{/if}

{#if onBack || $$slots.avatar || $$slots.title || $$slots.extra}
	<div class="flex mb-4 items-center gap-2">
		{#if onBack}
			<button class="btn-icon btn-icon-sm bg-surface-hover-token" on:click={onBack === true ? () => goBack() : onBack}>
				<ArrowLeft />
			</button>
		{/if}
		{#if $$slots.avatar}
			<div>
				<slot name="avatar" />
			</div>
		{/if}
		<div class="flex-1">
			<slot name="title" />
			{#if subtitle}
				<span class="text-neutral-500 text-sm">
					{subtitle}
				</span>
			{/if}
		</div>
		{#if $$slots.extra}
			<slot name="extra" />
		{/if}
	</div>
{/if}

<slot />

{#if $$slots.footer}
	<div class="mt-4">
		<slot name="footer" />
	</div>
{/if}