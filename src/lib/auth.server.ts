import { ADMIN_EMAIL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';

export function isAdmin(locals: App.Locals): boolean {
	return locals.pb?.authStore?.record?.email === ADMIN_EMAIL;
}

/**
 * Throw for requests that must only be performed by the configured admin.
 * - not logged in  -> redirect to /login
 * - logged in, but not admin -> 403
 */
export function requireAdmin(locals: App.Locals) {
	if (!locals.pb?.authStore?.record) {
		throw redirect(303, '/login');
	}
	if (!isAdmin(locals)) {
		throw error(403, { message: 'Not authorized' });
	}
}
