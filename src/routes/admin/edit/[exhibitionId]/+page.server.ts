import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { locale } from '$states/stateGeneral.svelte';

const CACHE_DIR = 'src/routes/[locale]/[type]/markdown/.cache';

export const load = (async ({ locals, params, fetch }) => {
    if (!locals.pb.authStore.model) {
        return redirect(303, '/login')
    }
    // return the infos about the user

    let markdown = [];
    let exhibition;

    // make temorary directory

    exhibition = await locals.pb.collection('exhibitions').getOne(params.exhibitionId, {
        expand: 'files',
    });

    if (exhibition.expand && exhibition.expand.files) {
        let fileObj;
        exhibition.expand.files.forEach((file: { lang: any; }) => {
            if (file.lang === locale.current) {
                fileObj = file;
            }
        });
        if (!fileObj) return
        console.log(fileObj, "file");
        const url = locals.pb.files.getURL(fileObj, fileObj.live);
        const response = await fetch(url);
        const content = await response.text();

        markdown.push(content);
    }

    return {
        exhibition,
        markdown,
    };
}) satisfies PageServerLoad;