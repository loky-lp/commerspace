<script lang="ts">
	import { derived } from 'svelte/store'
	import { getLeftMenuOpen, setLeftMenuOpen } from '$lib/context'
	import { NavItem } from '$lib/components'
	import { page } from '$app/stores'

	import {
		BuildingOutline,
		ChevronDoubleLeftOutline,
		ChevronDoubleRightOutline,
		UsersGroupOutline,
		UsersOutline,
	} from 'flowbite-svelte-icons'
	import { Avatar, Dropdown, DropdownDivider, DropdownItem } from 'flowbite-svelte'

	// We know that the user is present for sure because we check it inside +layout.server
	const user = derived(page, $p => $p.data!.session!.user)

	// TODO Store preference in localhost
	let preferLeftMenuOpen = true

	setLeftMenuOpen()
	// TODO Don't collapse menu if userDropdown is open
	const isOpen = getLeftMenuOpen()
	let userDropdownOpen = false

	function handleMenuEvent(e: MouseEvent | FocusEvent) {
		if (preferLeftMenuOpen) return

		// TODO implement focus and blur
		if (e.type == 'mouseenter')
			isOpen.set(true)
		if (e.type == 'mouseleave')
			isOpen.set(false)
	}

	// TODO Fetch the user menu visible voices

</script>

<div class="grid grid-cols-[auto_1fr] h-screen max-h-screen select-none">
	<!-- Nav menu -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="bg-neutral-100 border-r max-h-screen flex flex-col divide-y p-2"
	     on:mouseenter={e => handleMenuEvent(e)}
	     on:mouseleave={e => handleMenuEvent(e)}
	>
		<!-- Logo -->
		<div class="flex items-center pb-2">
			<img alt="Logo" class="w-10 h-10" src="/favicon.png">
			{#if $isOpen}
				<h1 class="text-2xl font-bold">Commerspace</h1>
			{/if}
		</div>

		<!-- Menu -->
		<nav class="flex-1 overflow-auto py-2">
			<ul class="list-none">
				<NavItem text="Utenti" click="/admin/user">
					<UsersGroupOutline class="menu-icon" slot="icon" />
				</NavItem>
				<NavItem text="Host" click="/admin/host">
					<UsersOutline class="menu-icon" slot="icon" />
				</NavItem>
				<NavItem text="Locations" click="/admin/location">
					<BuildingOutline class="menu-icon" slot="icon" />
				</NavItem>
				<NavItem text="CLICK ME" click={() => alert('THE POWER OF THE CLICK FLOWS IN ME')} />
			</ul>
		</nav>

		<!-- User Settings -->
		<div class="py-1">
			<button class="w-full py-1 hover:bg-neutral-200 transition-colors rounded-xl flex items-center">
				<Avatar class="w-10 h-10" src={$user.image ?? undefined}>
					{$user.name}
				</Avatar>
				{#if $isOpen}
					<span class="px-2 truncate max-w-[15ch]">
						{$user.name}
					</span>
				{/if}
			</button>
			<!-- This Dropdown is practically unusable, every style is applied to the core content and not the wrapper WTF -->
			<!-- It also use it's own font style, ignoring the one use across the app -->
			<Dropdown bind:open={userDropdownOpen} placement="right-end">
				<div slot="header" class="px-4 py-2">
					<span class="block">{$user.name}</span>
					<span class="block truncate text-neutral-500">{$user.email}</span>
				</div>
				<DropdownItem>Dashboard</DropdownItem>
				<DropdownDivider />
				<DropdownItem>Settings</DropdownItem>
				<DropdownItem>Earnings</DropdownItem>
				<DropdownItem>Sign out</DropdownItem>
			</Dropdown>
		</div>

		<!-- Menu control -->
		<button class="p-2 pt-4 flex justify-start items-center gap-2"
		        on:click={() => preferLeftMenuOpen = !preferLeftMenuOpen}
		>
			{#if preferLeftMenuOpen}
				<ChevronDoubleLeftOutline class="menu-icon inline" />
			{:else}
				<ChevronDoubleRightOutline class="menu-icon inline" />
			{/if}
			{#if $isOpen}
				{#if preferLeftMenuOpen}
					Comprimi menu
				{:else}
					Espandi menu
				{/if}
			{/if}
		</button>
	</div>

	<div class="overflow-auto">
		<slot />
	</div>
</div>
