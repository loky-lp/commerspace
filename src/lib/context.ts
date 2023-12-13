import { writable, type Writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'

type IsScrolledContext = Writable<boolean>

export function setIsScrolled(initialValue?: boolean) {
	const isScrolled = writable<boolean>(initialValue ?? false)
	setContext('is-scrolled-state', isScrolled)
}

export function getIsScrolled() {
	return getContext<IsScrolledContext>('is-scrolled-state')
}

type LeftMenuOpen = boolean
type LeftMenuOpenContext = Writable<boolean>

export function setLeftMenuOpen() {
	const leftMenuOpen = writable<LeftMenuOpen>(true)
	setContext('left-menu-open-state', leftMenuOpen)
}

export function getLeftMenuOpen() {
	return getContext<LeftMenuOpenContext>('left-menu-open-state')
}
