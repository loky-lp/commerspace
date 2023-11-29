<script lang="ts">
	import {
		Avatar,
		Button,
		Dropdown,
		DropdownDivider,
		DropdownItem,
		Navbar,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
	} from 'flowbite-svelte'
	import { page } from '$app/stores'
	import { signOut } from '@auth/sveltekit/client'

	$: activeUrl = $page.url.pathname
	$: user = $page.data.session?.user
</script>

<Navbar class="border-b-2">
	<NavBrand href="/">
		<img src="/favicon.png" class="mr-3 h-6 sm:h-9" alt="Commerspace Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold">Commerspace</span>
	</NavBrand>

	<div class="flex items-center md:order-2">
		{#if user}
			<Avatar id="user-menu" src={user.image ?? undefined}
			        class="cursor-pointer ring-0 hover:ring-4 ring-neutral-500/10 transition-all"
			/>
			<Dropdown placement="bottom-end" triggeredBy="#user-menu">
				<!--		<DropdownHeader>-->
				<div slot="header" class="px-4 py-2">
					<span class="block">{user.name}</span>
					<span class="block truncate text-neutral-500">{user.email}</span>
				</div>
				<!--		</DropdownHeader>-->
				<DropdownItem>Dashboard</DropdownItem>
				<DropdownItem>Settings</DropdownItem>
				<DropdownItem>Earnings</DropdownItem>
				<DropdownDivider />
				<DropdownItem on:click={() => signOut()}>Sign out</DropdownItem>
			</Dropdown>
		{:else}
			<Button href="/signin" color="alternative">
				Accedi
			</Button>
			<Button href="/signup" class="ml-3">
				Registrati
			</Button>
		{/if}
		<NavHamburger class="transition-colors duration-[2000]" />
	</div>
	<NavUl {activeUrl} class="order-1">
		<NavLi href="/">Home</NavLi>
		<NavLi href="/settings">Setting</NavLi>
		<NavLi href="/pricing">Pricing</NavLi>
		<NavLi href="/contact">Contact</NavLi>
	</NavUl>
</Navbar>

<slot />
