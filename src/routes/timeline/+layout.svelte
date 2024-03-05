<script lang="ts">
	import Maintimeline from './Maintimeline.svelte';
	import ListeEvents from '$components/listEvents/ListEvents.svelte';
</script>

<section>
	<Maintimeline />
	<ListeEvents />
	<slot />
</section>
