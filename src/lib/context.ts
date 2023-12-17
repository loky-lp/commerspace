import type { Readable, Writable } from 'svelte/store'
import { readonly, writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'
import type { Map } from 'mapbox-gl'

type IsScrolledContext = Writable<boolean>

export function setIsScrolled(initialValue?: boolean) {
	const isScrolled = writable<boolean>(initialValue ?? false)
	setContext('is-scrolled-state', isScrolled)
}

export function getIsScrolled() {
	return getContext<IsScrolledContext>('is-scrolled-state')
}

type MapboxState = Map | undefined
type MapboxContext = Readable<MapboxState>

export function setMapbox(map: Readable<MapboxState>) {
	const mapbox = readonly(map) satisfies MapboxContext
	setContext<MapboxContext>('mapbox-state', mapbox)
}

export function getMapbox() {
	return getContext<MapboxContext>('mapbox-state')
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
