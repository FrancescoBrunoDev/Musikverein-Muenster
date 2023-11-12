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
		class="undeline uppercase {$value === 'or'
			? 'underline'
			: 'no-underline'} decoration-4 ">{$LL.filters.methods.or()}</button
	>
	<button
		use:melt={$item('and')}
		class="undeline uppercase {$value === 'and' ? 'underline' : 'no-underline'} decoration-4"
		>{$LL.filters.methods.and()}</button
	>
	<button
		use:melt={$item('not')}
		class="undeline uppercase {$value === 'not'
			? 'underline'
			: 'no-underline'} decoration-4">{$LL.filters.methods.not()}</button
	>
</div>
