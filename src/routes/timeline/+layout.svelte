<script lang="ts">
	import { fetchedEvents } from '$stores/storeEvents';
	let formattedDate: string = 'loading...';

	// format the date (now  is 2023-11-11T20:22:22+01:00) in 11/11/2023
	$: {
		if ($fetchedEvents && $fetchedEvents.timestamp) {
			const date = new Date($fetchedEvents.timestamp);
			const day = date.getDate();
			const month = date.getMonth() + 1;
			const year = date.getFullYear();
			formattedDate = `${day}/${month}/${year}`;
		}
	}
</script>

<section>
	<slot />
	<div class="fixed bottom-0 left-0 top-0 flex h-screen items-center">
		<div style="writing-mode: vertical-rl;" class="rotate-180 text-[0.6rem] font-normal">
			Last update: {formattedDate}
		</div>
	</div>
</section>
