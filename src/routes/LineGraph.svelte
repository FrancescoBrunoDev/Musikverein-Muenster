<script lang="ts">
	import { Scatter } from '@unovis/ts';
	import { VisXYContainer, VisLine, VisAxis, VisScatter, VisTooltip } from '@unovis/svelte';
	import { dataForGraph } from './dataMusiconn';
	import { onMount } from 'svelte';

	let data: DataRecordCoordinates[]; // Declare data as a variable outside of onMount
	const x = (d: DataRecordCoordinates) => d.x;
	const y = (d: DataRecordCoordinates) => d.y;
	const triggers = {
		[Scatter.selectors.point]: (d: DataRecordCoordinates) =>
			`<span>x :  ${d.x}<br / >y :  ${d.y}</span>`
	};

	onMount(async () => {
		const response = await dataForGraph();
		data = response[0].data; // Assign the fetched data to the data variable
	});
</script>

{#if data && data.length > 0}
	<VisXYContainer {data} height={400} scaleByDomain={true} xDomain={[1850, 1900]} yDomain={[0, 20]}>
		<VisLine {x} {y} />
		<VisScatter {x} {y} size={10} />
		<VisTooltip {triggers} />
		<VisAxis gridLine={false} domainLine={false} tickLine={undefined} type="x" />
	</VisXYContainer>
{/if}
