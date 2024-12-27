import { fail, redirect } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (!locals.pb.authStore.record) {
		return redirect(303, '/login');
	}
	// return the infos about the user
	const user = await locals.pb.collection('users').getOne(locals.pb.authStore.record.id);
	const exhibitions = await locals.pb.collection('exhibitions').getFullList({
		expand: 'files'
	});
	return { user, exhibitions };
}) satisfies PageServerLoad;

export const actions = {
	logout: async ({ locals }) => {
		locals.pb.authStore.clear();
		return redirect(303, '/login');
	},
	addNewExhibition: async ({ locals, request }) => {
		const data = await request.formData();
		const title = data.get('title');
		console.log('title', title);
		//  first create a new file for en and for de using the blank
		const enPath = join(process.cwd(), 'src/routes/[locale]/[type]/markdown/en/new.md');
		const enContent = readFileSync(enPath, 'utf-8');
		const fileEn = await locals.pb.collection('exhibitionsFiles').create({
			lang: 'en',
			preview: [new File([enContent], 'preview.md', { type: 'text/markdown' })],
			editingBy: ''
		});
		const dePath = join(process.cwd(), 'src/routes/[locale]/[type]/markdown/de/new.md');
		const deContent = readFileSync(dePath, 'utf-8');
		const fileDe = await locals.pb.collection('exhibitionsFiles').create({
			lang: 'de',
			preview: [new File([deContent], 'preview.md', { type: 'text/markdown' })],
			editingBy: ''
		});
		const exhibition = await locals.pb.collection('exhibitions').create({
			title: title,
			visible: false,
			files: [fileEn.id, fileDe.id]
		});

		if (!exhibition) {
			return fail(400, { message: 'Failed to create exhibition' });
		}

		return { success: true };
	},
	modifyExhibition: async ({ locals, request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const title = data.get('title');
		console.log('id', id, title);
		const exhibition = await locals.pb.collection('exhibitions').update(id, {
			title: title
		});

		if (!exhibition) {
			return fail(400, { message: 'Failed to update exhibition' });
		}

		return { success: true };
	}
} satisfies Actions;
