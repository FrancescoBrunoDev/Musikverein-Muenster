import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
    if (!locals.pb.authStore.model) {
        return redirect(303, '/login')
    }
    // return the infos about the user
    const user = await locals.pb.collection('users').getOne(locals.pb.authStore.model.id);
    return { user };
}) satisfies PageServerLoad;

export const actions = {
    logout: async ({ locals }) => {
        locals.pb.authStore.clear();
        return redirect(303, '/login');
    }
}