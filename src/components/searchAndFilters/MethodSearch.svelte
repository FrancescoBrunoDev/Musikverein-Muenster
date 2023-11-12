<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import { createRadioGroup, melt } from '@melt-ui/svelte';
	import { UpdateSelectedMethodFilter } from '$stores/storeFilters';

	const {
		elements: { root, item },
		states: { value }
	} = createRadioGroup({
		defaultValue: 'or'
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
		class="undeline text-secondary uppercase {$value === 'or'
			? 'underline'
			: 'no-underline'} decoration-4 ">{$LL.orMethod()}</button
	>
	<button
		use:melt={$item('and')}
		class="undeline text-secondary uppercase {$value === 'and' ? 'underline' : 'no-underline'} decoration-4"
		>{$LL.andMethod()}</button
	>
	<button
		use:melt={$item('not')}
		class="undeline text-secondary uppercase {$value === 'not'
			? 'underline'
			: 'no-underline'} decoration-4">{$LL.notMethod()}</button
	>
</div>
