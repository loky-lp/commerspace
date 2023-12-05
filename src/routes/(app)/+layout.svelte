<script lang="ts">
	// import {
	// 	Avatar,
	// 	Button,
	// 	Dropdown,
	// 	DropdownDivider,
	// 	DropdownItem,
	// 	NavBrand,
	// 	NavHamburger,
	// 	NavLi,
	// 	NavUl,
	// } from 'flowbite-svelte'
	// import { AppNavBar } from '$lib/components'
	import type { PopupSettings } from '@skeletonlabs/skeleton'
	import { AppBar, AppShell, Avatar, Drawer, getDrawerStore, popup, storePopup } from '@skeletonlabs/skeleton'
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
	import { page } from '$app/stores'
	// import { signOut } from '@auth/sveltekit/client'

	// $: activeUrl = $page.url.pathname
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
	slotSidebarLeft="bg-surface-500/5 w-56 p-4"
>
	<svelte:fragment slot="header">
		<AppBar slotDefault="flex justify-center">
			<svelte:fragment slot="lead">
				<a class="flex items-center gap-3" href="/">
					<img alt="Commerspace Logo" class="h-6 sm:h-9" src="/favicon.png" />
					<span class="self-center whitespace-nowrap text-xl font-semibold">Commerspace</span>
				</a>
			</svelte:fragment>

			<svelte:fragment>
				<!-- TODO Better centering, let the sides grow-->
				<div
					class="hidden rounded-full md:flex items-center gap-1 bg-surface-50-900-token p-2 border border-surface-300-600-token"
				>
					<span class="mx-3">field 1</span>
					<span class="divider-vertical h-6" />
					<span class="mx-3">field 2</span>
					<button class="btn-icon btn-icon-sm variant-filled-primary">O</button>
				</div>
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
						<div class="card bg-surface-50-900-token flex flex-col gap-1 p-2">
							<a href="#TODO" class="btn hover:bg-surface-200-700-token ">Route 1</a>
							<a href="#TODO" class="btn hover:bg-surface-200-700-token ">Route 2</a>
							<a href="#TODO" class="btn hover:bg-surface-200-700-token ">Route 3</a>
							{#if user.role === 'ADMIN'}
								<hr class="!border-surface-100-800-token">
								<a href="#TODO" class="btn hover:bg-surface-200-700-token ">
									Admin or host link
								</a>
							{/if}
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

<!--<AppNavBar>-->
<!--	<NavBrand href="/">-->
<!--		<img src="/favicon.png" class="mr-3 h-6 sm:h-9" alt="Commerspace Logo" />-->
<!--		<span class="self-center whitespace-nowrap text-xl font-semibold">Commerspace</span>-->
<!--	</NavBrand>-->

<!--	<div class="flex items-center md:order-2">-->
<!--		{#if user}-->
<!--			<Avatar id="user-menu" src={user.image ?? undefined}-->
<!--			        class="cursor-pointer ring-0 hover:ring-4 ring-neutral-500/10 transition-all"-->
<!--			/>-->
<!--			<Dropdown placement="bottom-end" triggeredBy="#user-menu">-->
<!--				&lt;!&ndash;		<DropdownHeader>&ndash;&gt;-->
<!--				<div slot="header" class="px-4 py-2">-->
<!--					<span class="block">{user.name}</span>-->
<!--					<span class="block truncate text-neutral-500">{user.email}</span>-->
<!--				</div>-->
<!--				&lt;!&ndash;		</DropdownHeader>&ndash;&gt;-->
<!--				<DropdownItem>Dashboard</DropdownItem>-->
<!--				<DropdownItem>Settings</DropdownItem>-->
<!--				<DropdownItem>Earnings</DropdownItem>-->
<!--				<DropdownDivider />-->
<!--				<DropdownItem on:click={() => signOut()}>Sign out</DropdownItem>-->
<!--			</Dropdown>-->
<!--		{:else}-->
<!--			<Button href="/signin" color="alternative">-->
<!--				Accedi-->
<!--			</Button>-->
<!--			<Button href="/signup" class="ml-3">-->
<!--				Registrati-->
<!--			</Button>-->
<!--		{/if}-->
<!--		<NavHamburger class="transition-colors duration-[2000]" />-->
<!--	</div>-->
<!--	<NavUl {activeUrl} class="order-1">-->
<!--		<NavLi href="/">Home</NavLi>-->
<!--		<NavLi href="/settings">Setting</NavLi>-->
<!--		<NavLi href="/pricing">Pricing</NavLi>-->
<!--		<NavLi href="/contact">Contact</NavLi>-->
<!--	</NavUl>-->
<!--</AppNavBar>-->

<!--<slot />-->
