<script lang="ts">
	import Maintimeline from './Maintimeline.svelte';
	import ListeEvents from '$components/listEvents/ListEvents.svelte';
	import SettingsTimeline from '$components/listEvents/SettingsTimeline.svelte';

	let { children } = $props();
</script>

<section class="container isolate">
	<div class="sticky right-0 top-10 z-40 flex justify-end sm:top-16">
		<div class="flex gap-2 rounded-xl border-2 bg-background p-2 drop-shadow-xl">
			<SettingsTimeline />
		</div>
	</div>

	<Maintimeline />
	<ListeEvents />
	{@render children?.()}
</section>
