import { writable, type Writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'

type LeftMenuOpen = boolean
type LeftMenuOpenContext = Writable<boolean>

export function setLeftMenuOpen() {
	const leftMenuOpen = writable<LeftMenuOpen>(true)
	setContext('left-menu-open-state', leftMenuOpen)
}

export function getLeftMenuOpen() {
	return getContext<LeftMenuOpenContext>('left-menu-open-state')
}
