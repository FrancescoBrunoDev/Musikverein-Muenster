<script lang="ts">
	import Maintimeline from './Maintimeline.svelte';
	import ListeEvents from '$components/listEvents/ListEvents.svelte';

	let { children } = $props();
</script>

<section>
	<Maintimeline />
	<ListeEvents />
	{@render children?.()}
</section>
