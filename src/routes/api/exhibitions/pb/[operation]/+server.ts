import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, params }) => {
    if (params.operation === 'update') {
        return update({ request, locals });
    }
    throw error(400, {
        message: 'Invalid operation'
    });
};

async function update({ request, locals }: { request: Request; locals: any }) {
    try {
        const body = await request.json();
        const { markdown, id, field } = body;

        if (!markdown || !id) {
            throw error(400, {
                message: 'Markdown and id are required'
            });
        }

        const file = await locals.pb.collection('exhibitionsFiles').update(String(id), {
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