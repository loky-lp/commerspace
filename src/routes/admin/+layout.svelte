<script lang="ts">
	import { getLeftMenuOpen, setLeftMenuOpen } from '$lib/context'
	import { NavItem } from '$lib/components'
	import { page } from '$app/stores'

	import type { PopupSettings } from '@skeletonlabs/skeleton'
	import { AppShell, Avatar, storePopup, popup } from '@skeletonlabs/skeleton'
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
	import { BadgeHelp, Building2, ChevronsLeftRight, ChevronsRightLeft, CircleUser, Users } from 'lucide-svelte'

	// We know for sure that the user is present because we check it inside hooks.server
	$: user = $page.data.session!.user

	// TODO Store preference in localhost
	let preferLeftMenuOpen = true

	setLeftMenuOpen()
	const isMenuOpen = getLeftMenuOpen()
	let isUserPopupOpen = false

	function handleMenuEvent(e: MouseEvent | FocusEvent) {
		if (preferLeftMenuOpen || isUserPopupOpen) return

		// TODO implement focus and blur
		if (e.type == 'mouseenter')
			isMenuOpen.set(true)
		if (e.type == 'mouseleave')
			isMenuOpen.set(false)
	}
	$: openButtonText = preferLeftMenuOpen ? 'Comprimi menu' : 'Espandi menu'

	// TODO Fetch the user menu visible voices

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow })

	const userSettingsPopup: PopupSettings = {
		event: 'click',
		target: 'userSettingsPopup',
		placement: 'right-end',
		state: (e) => {
			isUserPopupOpen = e.state
			if (!e.state && !preferLeftMenuOpen)
				isMenuOpen.set(false)
		}
	}
</script>

<AppShell
	class="transition-transform"
	slotSidebarLeft="border-r bg-surface-100-800-token border-surface-300-600-token"
>
	<!-- Nav menu -->
	<svelte:fragment slot="sidebarLeft">
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- TODO: Add color utility token for divide -->
		<div class="h-full flex flex-col divide-y p-2 divide-surface-300"
		     on:mouseenter={e => handleMenuEvent(e)}
		     on:mouseleave={e => handleMenuEvent(e)}
		>
			<!-- Logo -->
			<div class="flex items-center pb-2 select-none">
				<img alt="Logo" class="w-10 h-10" src="/favicon.png">
				{#if $isMenuOpen}
					<h1 class="text-2xl font-bold">Commerspace</h1>
				{/if}
			</div>

			<!-- Menu -->
			<nav class="flex-1 overflow-auto py-2">
				<ul class="list-none">
					<NavItem text="Utenti" click="/admin/user">
						<Users slot="icon" />
					</NavItem>
					<NavItem text="Host" click="/admin/host">
						<CircleUser slot="icon" />
					</NavItem>
					<NavItem text="Locations" click="/admin/location">
						<Building2 slot="icon" />
					</NavItem>
					<NavItem text="Verifiche sospese" click="/admin/verify">
						<BadgeHelp slot="icon" />
					</NavItem>
					<NavItem text="CLICK ME" click={() => alert('THE POWER OF THE CLICK FLOWS IN ME')} />
				</ul>
			</nav>

			<!-- User Settings -->
			<div class="pt-2 pb-1"> <!-- For some reason the Avatar inside create a shift of .25rem on the bottom -->
				<button class="w-full btn p-0 justify-start bg-surface-hover-token" use:popup={userSettingsPopup}>
					<!-- TODO Extract user initials -->
					<Avatar background="bg-surface-300-600-token" class="border-token border-surface-300-600-token"
					        initials="JD" src={user.image ?? undefined} width="w-10"
					/>
					{#if $isMenuOpen}
					<span class="truncate max-w-[15ch]">
						{user.name}
					</span>
					{/if}
				</button>

				<!-- User Settings Popup -->
				<div class="w-max pl-2" data-popup="userSettingsPopup">
					<div
						class="rounded-token p-2 bg-surface-100-800-token border-token border-surface-300-600-token flex flex-col divide-y divide-surface-300"
					>
						<div class="flex items-center gap-2 pb-2">
							<!-- TODO Extract user initials -->
							<Avatar background="bg-surface-300-600-token" class="border-token border-surface-300-600-token"
							        initials="JD" src={user.image ?? undefined} width="w-16 h-16"
							/>
							<div>
								<span class="block">{user.name}</span>
								<span class="block truncate text-surface-500-400-token">{user.email}</span>

							</div>
						</div>
						<div class="py-2 flex flex-col">
							<a class="btn hover:bg-surface-200-700-token justify-start" href="#TODO">Route 1</a>
							<a class="btn hover:bg-surface-200-700-token justify-start" href="#TODO">Route 2</a>
							<a class="btn hover:bg-surface-200-700-token justify-start" href="#TODO">Route 3</a>
						</div>
						<div class="pt-2 flex flex-col">
							<a class="btn hover:bg-surface-200-700-token justify-start" href="#TODO">Logout</a>
						</div>
					</div>
				</div>
			</div>

			<!-- Menu control -->
			<div class="pt-2">
				<button class="w-full btn bg-surface-hover-token justify-start gap-2 px-2"
				        on:click={() => preferLeftMenuOpen = !preferLeftMenuOpen}
				>
					{#if preferLeftMenuOpen}
						<ChevronsRightLeft />
					{:else}
						<ChevronsLeftRight />
					{/if}
					{#if $isMenuOpen}
						{openButtonText}
					{/if}
				</button>
			</div>
		</div>
	</svelte:fragment>

	<!-- ---- / ---- -->
	<slot />
	<!-- ---- / ---- -->
</AppShell>
