<script lang="ts">
	import MainDatabase from '$routes/database/MainDatabase.svelte';
	import ListeEvents from '$components/listEvents/ListEvents.svelte';
	import SettingsDatabase from '$components/listEvents/SettingsDatabase.svelte';

	let { children } = $props();
</script>

<section class="container isolate">
	<div class="sticky right-0 top-10 z-40 flex justify-end sm:top-16">
		<div
			class="flex scale-90 gap-2 rounded-xl border-2 bg-background p-2 drop-shadow-xl sm:scale-100"
		>
			<SettingsDatabase />
		</div>
	</div>

	<MainDatabase />
	<ListeEvents />
	{@render children?.()}
</section>
