// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	namespace svelteHTML {
		interface HTMLAttributes {
			/**
			 * Fires when the Element intersects with the viewport or the defined root element.
			 * Custom event dispatched by {@link inView} action, won't work if the component doesn't use said action
			 */
			'on:viewEnter'?: (e: CustomEvent) => void
			/**
			 * Fires when the Element exits the intersection with the viewport or the defined root element.
			 * Custom event dispatched by {@link inView} action, won't work if the component doesn't use said action
			 */
			'on:viewExit'?: (e: CustomEvent) => void
		}
	}
}

export {}
