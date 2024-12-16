<script lang="ts">
	import { onDestroy } from 'svelte';

	let { children } = $props();

	let ref: Node | null = $state(null);
	let portal: HTMLDivElement | null = $state(null);
	let shouldRemovePortal = $state(false);
	let isAppended = $state(false);

	$effect(() => {
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
