<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let { children } = $props();

	let ref: Node | null = $state(null);
	let portal: HTMLDivElement | null = $state(null);

	onMount(() => {
		// Search for existing portal
		const existingPortal = document.querySelector('.portal');

		if (existingPortal) {
			// Use the existing portal if it exists
			portal = existingPortal as HTMLDivElement;
		} else {
			// Create a new portal if it doesn't exist
			portal = document.createElement('div');
			portal.className = 'portal';
			document.body.appendChild(portal);
		}

		// Append the ref to the portal
		if (ref) {
			portal.appendChild(ref);
		}
	});

	onDestroy(() => {
		if (portal) {
			document.body.removeChild(portal);
		}
	});
</script>

<div bind:this={ref}>
	{@render children?.()}
</div>
