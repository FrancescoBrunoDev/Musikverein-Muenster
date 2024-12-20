<script lang="ts">
	import { locale } from '$states/stateGeneral.svelte.js';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import DOMPurify from 'isomorphic-dompurify';

	import { Carta, MarkdownEditor } from 'carta-md';
	// Component default theme
	import 'carta-md/default.css';

	interface Props {
		data: PageData;
	}

	let { data = $bindable() }: Props = $props();

	let value = '';

	$inspect(data);
	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
	});
</script>

<div class="h-[95dvh]">
	<MarkdownEditor {carta} bind:value={data.markdown} />
</div>
