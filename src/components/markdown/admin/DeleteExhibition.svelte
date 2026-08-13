<script lang="ts">
	import Button from '$components/ui/Button.svelte';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		exhibitionId: string;
	}

	let { exhibitionId }: Props = $props();
	let deleting = $state(false);

	async function handleDeleteExhibition() {
		const confirmed = confirm('Delete this exhibition and all its files? This cannot be undone.');
		if (!confirmed) return;

		deleting = true;
		const res = await fetch('/api/exhibitions/pb/deleteExhibition', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: exhibitionId })
		});
		const result = await res.json();

		if (result.success) {
			await invalidateAll();
		} else {
			deleting = false;
			alert(result.message ?? 'Error deleting exhibition');
		}
	}
</script>

<Button
	action={handleDeleteExhibition}
	className="px-4 w-fit bg-destructive dark:text-text dark:text-dark-text"
	type="button"
	size="sm"
	disabled={deleting}
	label={deleting ? 'Deleting…' : 'Delete'}
></Button>
