<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let { children } = $props();

	let ref: Node | null = $state(null);
	let portal: HTMLDivElement | null = $state(null);
	let shouldRemovePortal = $state(false);
	let isAppended = $state(false);

	$effect(() => {
		if (ref && portal && !isAppended) {
			portal.appendChild(ref);
			isAppended = true;
		}
	});

	onMount(() => {
		const existingPortal = document.querySelector('.portal');

		if (existingPortal) {
			portal = existingPortal as HTMLDivElement;
			shouldRemovePortal = false;
		} else {
			portal = document.createElement('div');
			portal.className = 'portal';
			document.body.appendChild(portal);
			shouldRemovePortal = true;
		}
	});

	onDestroy(() => {
		if (ref && portal && isAppended) {
			try {
				portal.removeChild(ref);
			} catch (error) {
				console.error('Errore durante la rimozione del nodo:', error);
			}
		}

		if (shouldRemovePortal && portal && document.body.contains(portal)) {
			document.body.removeChild(portal);
		}
	});
</script>

<div bind:this={ref}>
	{@render children?.()}
</div>
