import type { PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load = (async ({ locals, params, fetch }) => {
    if (!locals.pb.authStore.record) {
        return redirect(303, '/login')
    }

    // make temorary directory
    try {
        let exhibition = await locals.pb.collection('exhibitions').getOne(params.exhibitionId, {
            expand: 'files'
        });

        if (exhibition.files) {
            let fileObj = await locals.pb.collection('exhibitionsFiles').getOne(params.fileId);
            if (!fileObj) return fail(404, { message: 'File not Found' });

            if (fileObj.editingBy === "") {
                //TODO: dopo qualche minuto di inattività, il file deve essere sbloccato
                fileObj = await locals.pb.collection('exhibitionsFiles').update(fileObj.id, {
                    "editingBy": locals.pb.authStore.record.id
                });
            } else if (fileObj.editingBy !== locals.pb.authStore.record.id) {
                // if the last updated is more than 5 minutes ago, unlock the file
                return fail(403, { message: 'This file is editing by another user' });

            }
            console.log(fileObj, "fileObj");
            let url = locals.pb.files.getURL(fileObj, fileObj.preview);

            let response = await fetch(url);
            let content = await response.text();
            console.log(content, "content");
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
