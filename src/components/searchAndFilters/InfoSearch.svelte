<script lang="ts">
	import Modal from '$components/ui/Modal.svelte';
	import { Info } from 'lucide-svelte';
	import { error } from '@sveltejs/kit';
	import { locale } from '$stores/storeGeneral';

	let isOpen = $state(false);
	let markdownData = $state({ content: '', meta: { title: '' } });
	$inspect(markdownData);

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

<button onclick={() => (isOpen = !isOpen)}>
	<Info size={25} stroke-width={40} />
</button>

<Modal {isOpen}>
	<div
		class="rounded-xl bg-background p-3 dark:bg-primary dark:text-background max-h-[90dvh] overflow-y-auto"
	>
		<h3 class="mb-10 text-3xl font-bold">{markdownData.meta.title}</h3>
		<Markdown />
	</div>
</Modal>
