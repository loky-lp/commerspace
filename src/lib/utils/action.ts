import type { Action } from 'svelte/action'

/**
 * This action triggers a custom event on node entering/exiting the viewport or the root element if defined.
 * example:
 * ```html
 * <p
 *   use:inView
 *   on:enter={() => console.log("enter")}
 *   on:exit={() => console.log("exit")}
 * >
 * ```
 *
 * @param node
 * @param params
 */
export const inView: Action<Element, IntersectionObserverInit | undefined> = (node, params = undefined) => {
	let observer: IntersectionObserver

	const handleIntersect: IntersectionObserverCallback = (e) => {
		const v = e[0].isIntersecting ? 'viewEnter' : 'viewExit'
		node.dispatchEvent(new CustomEvent(v))
	}

	const setObserver = (options?: IntersectionObserverInit) => {
		if (observer)
			observer.disconnect()

		observer = new IntersectionObserver(handleIntersect, options)
		observer.observe(node)
	}

	setObserver(params)

	return {
		update(params) {
			setObserver(params)
		},
		destroy() {
			if (observer)
				observer.disconnect()
		},
	}
}
