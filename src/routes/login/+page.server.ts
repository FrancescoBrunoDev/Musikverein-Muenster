import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';

export const load = (async ({ locals }) => {
    if (locals.pb.authStore.record) {
        return redirect(303, '/admin')
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
            return fail(400, { message: message, emailRequired: email === null, passwordRequired: password === null });
        }

        try {
            await locals.pb.collection('users').authWithPassword(email.toString(), password.toString());
        } catch (error) {
            const errorObj = error as ClientResponseError;
            return fail(500, { fail: true, message: errorObj.data.message });
        }

        throw redirect(303, '/admin');
    }
}