import { goto } from '$app/navigation';

// TODO Fix the buggy behaviour
export function goBack(defaultRoute = '/') {
	const ref = document.referrer;
	goto(ref.length > 0 ? ref : defaultRoute).then()
}
