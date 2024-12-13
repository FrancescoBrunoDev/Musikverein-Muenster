<script lang="ts">
	import { scaleLinear, max, line, curveBumpX } from 'd3';
	import Axis from '$components/graphs/Axis.svelte';
	import { startYear, endYear } from '$stores/storeEvents';
	import Tooltip from '$components/graphs/line/Tooltip.svelte';

	export type DataPoint = {
		year: number;
		value: number;
	};

	export type DataSeries = {
		name: string;
		color: string;
		data: DataPoint[];
	};

	let { data = [] }: { data: DataSeries[] } = $props();

	let width = $state(800);
	let height = $state(300);
	let margin = $state({ top: 20, right: 30, bottom: 30, left: 40 });

	let xDomain = $state([$startYear, $endYear + 10] as [number, number]);

	let allDataPoints = $derived(data.flatMap((d) => d.data));

	let xScale = $derived.by(() =>
		scaleLinear()
			.domain(xDomain)
			.range([margin.left, width - margin.right])
	);
	let yScale = $derived.by(() =>
		scaleLinear()
			.domain([0, (max(allDataPoints, (d) => d.value) as number) + 5])
			.nice()
			.range([height - margin.bottom, margin.top])
	);

	let lineGenerator = $derived.by(() =>
		line<DataPoint>()
			.x((d) => xScale(d.year))
			.y((d) => yScale(d.value))
			.curve(curveBumpX)
	);

	// Ensure each series has a data point for each year in the range
	let yearsRange = $derived.by(() => {
		let [minYear, maxYear] = xDomain;
		let years = [];
		for (let year = minYear; year <= maxYear; year++) {
			years.push(year);
		}
		return years;
	});
	let completeData = $derived.by(() => {
		return data.map((series) => {
			let completeSeriesData = yearsRange.map((year) => {
				let dataPoint = series.data.find((d) => d.year === year);
				return dataPoint ? dataPoint : { year, value: 0 };
			});
			return { ...series, data: completeSeriesData };
		});
	});

	let mousePosition: number | null = $state(null);
</script>

<div class="max-w-3xl w-11/12" bind:clientWidth={width}>
	{#if completeData && width}
		<svg
			class="w-full"
			{width}
			{height}
			onmousemove={(event: MouseEvent) => {
				const rect = (event.currentTarget as SVGElement).getBoundingClientRect();
				mousePosition = event.clientX - rect.left - margin.left - 5;
			}}
			onmouseleave={() => {
				mousePosition = null;
			}}
			role="img"
		>
			<Axis
				noDomain={true}
				noTicksLine={true}
				{width}
				{height}
				{margin}
				scale={xScale}
				position="bottom"
				textColor="hsl(var(--text))"
				removeFirstAndLastTicks={true}
			/>
			<Axis
				noDomain={true}
				noTicksLine={false}
				{width}
				{height}
				{margin}
				scale={yScale}
				position="left"
				textColor="hsl(var(--border))"
				removeFirstTick={true}
			/>
			<g>
				{#each completeData as series}
					<path
						d={lineGenerator(series.data) as string}
						fill="none"
						stroke={series.color}
						stroke-width="2"
					/>
					{#if mousePosition !== null}
						<Tooltip
							{mousePosition}
							{xScale}
							{yScale}
							{margin}
							{height}
							{xDomain}
							{series}
							data={completeData}
							{width}
						/>
					{/if}
				{/each}
			</g>
		</svg>
	{:else}
		<p>No data</p>
	{/if}
</div>
