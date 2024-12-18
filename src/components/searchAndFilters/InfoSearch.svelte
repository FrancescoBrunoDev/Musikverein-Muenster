<script lang="ts">
	import Modal from '$components/ui/Modal.svelte';
	import { Info } from 'lucide-svelte';
	import { error } from '@sveltejs/kit';
	import { locale } from '$stores/storeGeneral';

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

<button onclick={() => (isOpen = !isOpen)}>
	<Info size={25} stroke-width={40} />
</button>

<Modal bind:isOpen>
	<div
		class="rounded-xl bg-background dark:bg-primary dark:text-background max-h-[80dvh] overflow-y-auto"
	>
		<h3 class="mb-10 text-3xl font-bold px-4 pt-4 pb-0 sticky top-0 bg-background">
			{markdownData.meta.title}
		</h3>
		<div class="px-4 pb-4 content">
			<Markdown />
		</div>
	</div>
</Modal>
