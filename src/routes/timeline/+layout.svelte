<script lang="ts">
	import Maintimeline from './Maintimeline.svelte';
	import ListeEvents from '$components/listEvents/ListEvents.svelte';
	import SettingsTimeline from '$components/listEvents/SettingsTimeline.svelte';

	let { children } = $props();
</script>

<section class="container">
	<div class="sticky z-40 sm:top-16 top-10 right-0 flex justify-end">
		<div class=" flex gap-2 bg-background p-2 rounded-xl drop-shadow-xl">
			<SettingsTimeline />
		</div>
	</div>

	<Maintimeline />
	<ListeEvents />
	{@render children?.()}
</section>
