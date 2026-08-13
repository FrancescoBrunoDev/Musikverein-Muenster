import { requireAdmin } from '$lib/auth.server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const BLANK_MARKDOWN = `---
title:
description:
img:
---

`;
const FILE_NAME = 'preview.md';

export const load = (async ({ locals }) => {
	requireAdmin(locals);

	const user = await locals.pb.collection('users').getOne(locals.pb.authStore.record!.id);
	const exhibitions = await locals.pb.collection('exhibitions').getFullList({
		sort: 'sort,created',
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
		requireAdmin(locals);
		const data = await request.formData();
		const title = String(data.get('title') ?? '').trim();

		if (!title) {
			return fail(400, { message: 'Title is required' });
		}

		const fileEn = await locals.pb.collection('exhibitionsFiles').create({
			lang: 'en',
			preview: [new File([BLANK_MARKDOWN], FILE_NAME, { type: 'text/markdown' })],
			editingBy: ''
		});
		const fileDe = await locals.pb.collection('exhibitionsFiles').create({
			lang: 'de',
			preview: [new File([BLANK_MARKDOWN], FILE_NAME, { type: 'text/markdown' })],
			editingBy: ''
		});

		const exhibitions = await locals.pb.collection('exhibitions').getFullList();
		const exhibition = await locals.pb.collection('exhibitions').create({
			title,
			visible: false,
			sort: exhibitions.length,
			files: [fileEn.id, fileDe.id]
		});

		if (!exhibition) {
			return fail(400, { message: 'Failed to create exhibition' });
		}

		return { success: true };
	},
	modifyExhibition: async ({ locals, request }) => {
		requireAdmin(locals);
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		const title = String(data.get('title') ?? '').trim();

		if (!id || !title) {
			return fail(400, { message: 'Id and title are required' });
		}

		const exhibition = await locals.pb.collection('exhibitions').update(id, {
			title
		});

		if (!exhibition) {
			return fail(400, { message: 'Failed to update exhibition' });
		}

		return { success: true };
	}
} satisfies Actions;
