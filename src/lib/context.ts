import type { Readable, Writable } from 'svelte/store'
import { readonly, writable } from 'svelte/store'
import { getContext, setContext } from 'svelte'
import type { Map } from 'mapbox-gl'

// region Frontend scrolling context

type IsScrolled = boolean
type IsScrolledContext = Writable<IsScrolled>

export function setIsScrolled(initialValue?: IsScrolled) {
	const isScrolled = writable(initialValue ?? false) satisfies IsScrolledContext
	setContext('is-scrolled-state', isScrolled)
}

export function getIsScrolled() {
	return getContext<IsScrolledContext>('is-scrolled-state')
}

// endregion Frontend scrolling context

// region Mapbox context

type MapboxState = Map | undefined
type MapboxContext = Readable<MapboxState>

export function setMapbox(map: Readable<MapboxState>) {
	const mapbox = readonly(map) satisfies MapboxContext
	setContext<MapboxContext>('mapbox-state', mapbox)
}

export function getMapbox() {
	return getContext<MapboxContext>('mapbox-state')
}

// endregion Mapbox context

// region Admin left menu open context

type LeftMenuOpen = boolean
type LeftMenuOpenContext = Writable<LeftMenuOpen>

export function setLeftMenuOpen() {
	// TODO: Save in local storage
	const leftMenuOpen = writable(true) satisfies LeftMenuOpenContext
	setContext('left-menu-open-state', leftMenuOpen)
}

export function getLeftMenuOpen() {
	return getContext<LeftMenuOpenContext>('left-menu-open-state')
}

// endregion Admin left menu open context
