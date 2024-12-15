<script lang="ts">
	import InfoSearch from '$components/searchAndFilters/InfoSearch.svelte';
	import MenuDropdown from '$components/ui/MenuDropdown.svelte';
	import CheckBox from '$components/ui/CheckBox.svelte';
	import { isMoveToActive } from '$stores/storeFilters';
	import { Settings } from 'lucide-svelte';
</script>

<InfoSearch />
<MenuDropdown icon={Settings} direction={'bottom'}>
	<div>
		<CheckBox title={'show move option on  filter hover'} bind:value={$isMoveToActive} />
	</div>
</MenuDropdown>
