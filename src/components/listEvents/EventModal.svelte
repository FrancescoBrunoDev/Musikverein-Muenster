<script>
	import Modal from '$components/ui/Modal.svelte';
	import { getTitleString, getFormattedDate } from '$stores/storeEvents';
	import { cn } from '$lib/utils';
	import { Circle, FileInput } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import LL from '$lib/i18n/i18n-svelte';
	import { filters } from '$stores/storeFilters';
	import EventPerformances from './EventPerformances.svelte';
	import Event from './Event.svelte';

	let { event, isEventOpen = $bindable() } = $props();

	let date = $derived.by(() => getFormattedDate({ event }));
</script>

<Modal bind:isOpen={isEventOpen}>
	<Event {event} isModalOpen={isEventOpen} />
</Modal>
