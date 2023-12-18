<script lang="ts">
	import type { PopupSettings } from '@skeletonlabs/skeleton'
	import { AppBar, AppShell, Avatar, Drawer, getDrawerStore, popup, storePopup } from '@skeletonlabs/skeleton'
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
	import { page } from '$app/stores'
	import { signOut } from '@auth/sveltekit/client'
	import { onMount } from 'svelte'
	import { getIsScrolled, setIsScrolled } from '$lib/context'

	$: isIndexPage = $page.url.pathname == '/'
	$: user = $page.data.session?.user

	const drawerStore = getDrawerStore()
	$: positionClasses = $drawerStore.open ? '-translate-x-[10%]' : ''

	function drawerOpen(): void {
		drawerStore.open()
	}

	function drawerClose(): void {
		drawerStore.close()
	}

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

	const popupClick: PopupSettings = {
		event: 'click',
		target: 'popupClick',
		placement: 'bottom-end',
	}

	setIsScrolled()
	const isScrolled = getIsScrolled()
	onMount(() => {
		if (isIndexPage) {
			// HACK: This is the css id used by Skeleton, when the library updates this without notice this breaks easily
			const pageContent = document.getElementById('page') as HTMLDivElement

			pageContent.addEventListener('scroll', () => {
				isScrolled.set(pageContent.scrollTop != 0)
			}, { passive: true })
		}
	})

	$: headerProps = {
		slotHeader: isIndexPage ? 'fixed w-full' : '',
		background: isIndexPage
			? !$isScrolled
				? 'bg-transparent'
				: user
					? 'bg-primary-500'
					: 'bg-surface-900'
			: user
				? 'bg-primary-500'
				: 'bg-surface-900',
		class: isIndexPage
			? `transition-[background-color] ${user
				? 'text-current'
				: $isScrolled
					? 'text-surface-50'
					: 'text-current'}`
			: user
				? 'text-on-primary-token'
				: 'text-on-surface-token',
	}
</script>

<Drawer opacityTransition={false} position="right">
	<h2 class="p-4">TODO Collapsable user info</h2>
	<hr />
	<nav class="list-nav p-4">
		<ul>
			<li><a href="/" on:click={drawerClose}>Homepage</a></li>
			<li><a href="/admin" on:click={drawerClose}>Admin</a></li>
			<li><a href="/host" on:click={drawerClose}>Host</a></li>
			<li><a href="/signin" on:click={drawerClose}>Signin</a></li>
		</ul>
	</nav>
</Drawer>

<AppShell
	class="transition-transform {positionClasses}"
	slotHeader={headerProps.slotHeader}
	slotSidebarLeft="bg-surface-500/5 w-56 p-4"
>
	<svelte:fragment slot="header">
		<AppBar
			background={headerProps.background}
			class={headerProps.class}
			slotDefault="flex justify-center"
		>
			<svelte:fragment slot="lead">
				<a class="flex items-center gap-3" href="/">
					<img alt="Commerspace Logo" class="h-6 sm:h-9" src="/favicon.png" />
					<span class="self-center whitespace-nowrap text-xl font-semibold">Commerspace</span>
				</a>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<!-- TODO Refine -->
				<button class="md:hidden btn btn-sm" on:click={drawerOpen}>
						<span>
							<svg class="fill-token w-4 h-4" viewBox="0 0 17 14" xmlns="http://www.w3.org/2000/svg">
								<path d="M1 1h15M1 7h15M1 13h15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
								      stroke-width="2"
								/>
							</svg>
						</span>
				</button>
				{#if user}
					<div class="inline-block" use:popup={popupClick}>
						<!-- TODO Extract user initials -->
						<Avatar src={user.image ?? undefined} initials="JD" width="w-10" background="bg-primary-500"
						        class="cursor-pointer ring-1 ring-surface-300-600-token hover:ring-4 hover:ring-primary-500 transition-all"
						/>
					</div>

					<div class="w-max px-2" data-popup="popupClick">
						<div class="card bg-surface-50-900-token flex flex-col p-2">
							<a href="#TODO" class="btn hover:bg-surface-200-700-token ">Route 1</a>
							<a href="#TODO" class="btn hover:bg-surface-200-700-token ">Route 2</a>
							<a href="#TODO" class="btn hover:bg-surface-200-700-token ">Route 3</a>
							{#if user.role === 'ADMIN'}
								<hr class="!border-surface-100-800-token my-2">
								<a href="/admin" class="btn hover:bg-surface-200-700-token ">
									Sezione admin
								</a>
							{/if}
							{#if user.role === 'HOST'}
								<hr class="!border-surface-100-800-token my-2">
								<a href="/host" class="btn hover:bg-surface-200-700-token ">
									Dashboard privata
								</a>
							{/if}
							<hr class="!border-surface-100-800-token my-2">
							<button class="btn justify-start hover:bg-surface-200-700-token" on:click={() => signOut()}>
								Esci
							</button>
						</div>
					</div>
				{:else}
					<div class="hidden md:flex items-center gap-3">
						<a href="/signin" class="btn variant-ringed-primary">Accedi</a>
						<a href="/signup" class="btn variant-filled-primary">Registrati</a>
					</div>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- ---- / ---- -->
	<slot />
	<!-- ---- / ---- -->

	<svelte:fragment slot="pageFooter">TODO Footer</svelte:fragment>
</AppShell>
