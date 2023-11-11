<script lang="ts">
	import { createRadioGroup, melt } from '@melt-ui/svelte';
	import { UpdateSelectedMethodFilter, filters } from '$stores/storeFilters';

	const {
		elements: { root, item },
		states: { value },
	} = createRadioGroup({
		defaultValue: 'or',
	});
	$: {
		UpdateSelectedMethodFilter($value as Method);
	}
</script>

<div
	use:melt={$root}
	class="group flex place-items-center items-center justify-center gap-1 pl-5 font-bold"
>
	<button
		use:melt={$item('or')}
		class="undeline text-secondary disabled:opacity-50 {$value === 'or'
			? 'underline'
			: 'no-underline'} decoration-4">OR</button
	>
	<button
		use:melt={$item('and')}
		class="undeline text-secondary {$value === 'and' ? 'underline' : 'no-underline'} decoration-4"
		>AND</button
	>
	<button
		use:melt={$item('not')}
		class="undeline text-secondary disabled:opacity-50 {$value === 'not'
			? 'underline'
			: 'no-underline'} decoration-4">NOT</button
	>
</div>
