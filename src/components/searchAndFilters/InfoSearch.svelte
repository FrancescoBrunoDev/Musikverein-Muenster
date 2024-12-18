<script lang="ts">
	import Modal from '$components/ui/Modal.svelte';
	import { Info } from 'lucide-svelte';
	import { error } from '@sveltejs/kit';
	import { locale } from '$stores/storeGeneral';
	import Button from '$components/ui/Button.svelte';

	let isOpen = $state(false);
	let markdownData = $state({ content: '', meta: { title: '' } });

	async function loadMarkdownContent({ locale }: { locale: Locales }) {
		try {
			const infos = await import(`$routes/database/markdown/infos.${locale}.md`);
			markdownData = {
				content: infos.default,
				meta: infos.metadata
			};
		} catch (e) {
			error(404, `Could not find infos.${locale}.md`);
		}
	}

	$effect(() => {
		loadMarkdownContent({ locale: $locale });
	});
	let Markdown: any = $derived(markdownData.content);
</script>

<Button action={() => (isOpen = !isOpen)} size="md" icon={Info} light={true} />

<Modal bind:isOpen>
	<div class="max-h-[80dvh] overflow-y-auto rounded-xl bg-background dark:border-2">
		<h3 class="sticky top-0 mb-10 bg-background px-4 pb-0 pt-4 text-3xl font-bold">
			{markdownData.meta.title}
		</h3>
		<div class="content px-4 pb-4">
			<Markdown />
		</div>
	</div>
</Modal>
