<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import Modal from '$components/ui/Modal.svelte';
	import { Info } from 'lucide-svelte';

	let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = !isOpen)}>
	<Info size={25} stroke-width={40} />
</button>

<Modal {isOpen}>
	<div class="rounded-xl bg-background p-2 dark:bg-primary dark:text-background">
		<h3 class="text-lg font-bold">{$LL.filters.infoSearch.title()}</h3>
		<p>{$LL.filters.infoSearch.description()}</p>
	</div>
</Modal>
