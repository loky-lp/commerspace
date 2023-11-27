import { goto } from '$app/navigation';

export function goBack(defaultRoute = '/') {
	const ref = document.referrer;
	goto(ref.length > 0 ? ref : defaultRoute).then()
}
