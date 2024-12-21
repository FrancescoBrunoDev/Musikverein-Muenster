import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
    if (!locals.pb.authStore.record) {
        return redirect(303, '/login')
    }
    // return the infos about the user
    const user = await locals.pb.collection('users').getOne(locals.pb.authStore.record.id);
    const exhibitions = await locals.pb.collection('exhibitions').getFullList({
        expand: 'files',
    });
    return { user, exhibitions };
}) satisfies PageServerLoad;

export const actions = {
    logout: async ({ locals }) => {
        locals.pb.authStore.clear();
        return redirect(303, '/login');
    }
}