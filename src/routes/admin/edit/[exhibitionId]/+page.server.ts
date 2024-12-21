import type { PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { locale } from '$states/stateGeneral.svelte';

export const load = (async ({ locals, params, fetch }) => {
    if (!locals.pb.authStore.record) {
        return redirect(303, '/login')
    }

    // make temorary directory
    try {
        let exhibition = await locals.pb.collection('exhibitions').getOne(params.exhibitionId, {
            expand: 'files',
        });

        if (exhibition.expand && exhibition.expand.files) {
            let fileObj;
            exhibition.expand.files.forEach((file: { lang: any; }) => {
                if (file.lang === locale.current) {
                    fileObj = file;
                }
            });
            if (!fileObj) return fail(404, { message: 'File not Found' });
            const url = locals.pb.files.getURL(fileObj, fileObj.preview);
            const response = await fetch(url);
            const content = await response.text();

            return {
                exhibition,
                markdown: content,
                file: fileObj
            };
        }
    } catch (e) {
        return fail(500, { message: 'Error during the loading' });
    }
}) satisfies PageServerLoad;
