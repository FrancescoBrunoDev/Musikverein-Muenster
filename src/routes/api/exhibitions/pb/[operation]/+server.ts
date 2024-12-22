import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFileSync } from 'fs';
import { join } from 'path';

export const POST: RequestHandler = async ({ request, locals, params }) => {
    if (params.operation === 'updateFile') {
        return updateFile({ request, locals });
    } else if (params.operation === 'addNewExhibition') {
        return addNewExhibition({ locals });
    } else if (params.operation === 'deleteExhibition') {
        return deleteExhibition({ request, locals });
    } else if (params.operation === 'publishExhibition') {
        return publishExhibition({ request, locals });
    }
    throw error(400, {
        message: 'Invalid operation'
    });
};

async function updateFile({ request, locals }: { request: Request; locals: any }) {
    try {
        const body = await request.json();
        const { markdown, id, field, collection } = body;

        if (!markdown || !id) {
            throw error(400, {
                message: 'Markdown and id are required'
            });
        }

        const file = await locals.pb.collection(collection).update(String(id), {
            [field]: [
                new File([markdown], 'preview.md', { type: 'text/markdown' })
            ]
        });

        if (!file) {
            throw error(500, {
                message: 'Failed to save file'
            });
        }

        return json({ success: true, updated: file.updated }, { status: 200 });
    } catch (e) {
        throw error(400, {
            message: 'Errore durante il salvataggio'
        });
    }
}

async function addNewExhibition({ locals }: { locals: any }) {
    try {
        //  first create a new file for en and for de using the blank
        const enPath = join(process.cwd(), 'src/routes/[locale]/[type]/markdown/en/new.md');
        const enContent = readFileSync(enPath, 'utf-8');
        const fileEn = await locals.pb.collection('exhibitionsFiles').create({
            "lang": 'en',
            "preview": [
                new File([enContent], 'preview.md', { type: 'text/markdown' })
            ],
            "editingBy": ''
        });
        const dePath = join(process.cwd(), 'src/routes/[locale]/[type]/markdown/de/new.md');
        const deContent = readFileSync(dePath, 'utf-8');
        const fileDe = await locals.pb.collection('exhibitionsFiles').create({
            "lang": 'de',
            "preview": [
                new File([deContent], 'preview.md', { type: 'text/markdown' })
            ],
            "editingBy": ''
        });
        const exhibition = await locals.pb.collection('exhibitions').create({
            "title": 'New Exhibition',
            "visible": false,
            "files": [
                fileEn.id,
                fileDe.id
            ]
        });

        if (!exhibition) {
            throw error(500, {
                message: 'Failed to create exhibition'
            });
        }

        return json({ success: true, exhibition }, { status: 200 });
    } catch (e) {
        throw error(400, {
            message: 'Errore durante la creazione'
        });
    }
}

async function deleteExhibition({ locals, request }: { locals: any, request: Request }) {
    try {
        const body = await request.json();
        const { id } = body;
        const exhibition = await locals.pb.collection('exhibitions').getOne(id);
        const stateElimination = await locals.pb.collection('exhibitions').delete(id);
        // delete the files
        const files = exhibition.files;
        files.forEach(async (file: any) => {
            await locals.pb.collection('exhibitionsFiles').delete(file);
        });
        if (!exhibition) {
            throw error(500, {
                message: 'Failed to delete exhibition'
            });
        }

        return json({ success: true, stateElimination }, { status: 200 });
    } catch (e) {
        throw error(400, {
            message: 'Errore durante la cancellazione'
        });
    }
}

async function publishExhibition({ locals, request }: { locals: any, request: Request }) {
    try {
        const body = await request.json();
        const { id } = body;
        const file = await locals.pb.collection('exhibitionsFiles').getOne(id);
        const url = locals.pb.files.getURL(file, file.preview);
        const fileLive = await locals.pb.collection('exhibitionsFiles').update(id, {
            "live": [
                new File([url], 'preview.md', { type: 'text/markdown' })
            ]
        });
        if (!file) {
            throw error(500, {
                message: 'Failed to delete exhibition'
            });
        }

        return json({ success: true, fileLive }, { status: 200 });
    } catch (e) {
        throw error(400, {
            message: 'Errore durante la cancellazione'
        });
    }
}

async function deleteFile({ locals }: { locals: any }) {
    try {
        //TODO: questo metodo bisogna finirlo
        const file = await locals.pb.collection('exhibitionsFiles').delete('id');
        if (!file) {
            throw error(500, {
                message: 'Failed to delete file'
            });
        }

        return json({ success: true, file }, { status: 200 });
    } catch (e) {
        throw error(400, {
            message: 'Errore durante la cancellazione'
        });
    }
}