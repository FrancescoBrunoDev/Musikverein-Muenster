<script lang="ts">
	import { bisector } from 'd3';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { startYear } from '$stores/storeEvents';
	import { type DataPoint } from '$components/graph/LineGraphD3.svelte';

	let { xScale, yScale, margin, height, xDomain, series, mousePosition } = $props();

	const activeYearTween = new Tween($startYear, {
		duration: 200,
		easing: cubicOut
	});

	function getPointOnCurve(data: DataPoint[], year: number) {
		const bisect = bisector((d: DataPoint) => d.year).left;
		const i = bisect(data, year);

		if (i === 0) return data[0];
		if (i >= data.length) return data[data.length - 1];

		const a = data[i - 1];
		const b = data[i];

		const t = (year - a.year) / (b.year - a.year);
		return {
			year,
			value: a.value + (b.value - a.value) * t
		};
	}

	$effect(() => {
		if (mousePosition) {
			const year = Math.round(xScale.invert(mousePosition + margin.left - 10));
			if (year >= xDomain[0] && year <= xDomain[1]) {
				activeYearTween.set(year);
			}
		} else {
			activeYearTween.set($startYear);
		}
	});
</script>

{#if activeYearTween}
	{#each series.data as _, i}
		{@const point = getPointOnCurve(series.data, activeYearTween.current)}
		<circle
			cx={xScale(point.year)}
			cy={yScale(point.value)}
			r="4"
			fill={series.color}
			stroke="hsl(var(--background))"
			stroke-width="2"
		/>
		<line
			x1={xScale(point.year)}
			y1={yScale(point.value)}
			x2={xScale(point.year)}
			y2={height - margin.bottom}
			stroke={series.color}
			stroke-width="1"
			stroke-dasharray="4"
		/>
	{/each}
{/if}
