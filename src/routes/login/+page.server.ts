import { isAdmin } from '$lib/auth.server';
import { fail, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (locals.pb.authStore.record && isAdmin(locals)) {
		return redirect(303, '/admin');
	}

	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async ({ locals, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email || !password) {
			const message = 'Email and password are required';
			return fail(400, {
				message: message,
				emailRequired: email === null,
				passwordRequired: password === null
			});
		}

		try {
			await locals.pb.collection('users').authWithPassword(email.toString(), password.toString());
		} catch (error) {
			const errorObj = error as ClientResponseError;
			return fail(500, { fail: true, message: errorObj.data.message });
		}

		if (!isAdmin(locals)) {
			locals.pb.authStore.clear();
			return fail(403, { fail: true, message: 'This account is not an administrator' });
		}

		throw redirect(303, '/admin');
	}
};
