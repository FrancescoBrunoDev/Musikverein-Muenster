<script>
	import * as config from '$lib/config';
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<div class="relative flex h-screen w-screen flex-col items-center justify-center">
	<div class="noise h-96 w-96 rounded-full" />
	<h1 class="z-10 text-center font-serif text-8xl">MusikVerein<br />Münster</h1>
</div>

<style>
	.noise {
		background: linear-gradient(to top right, hsl(var(--primary)), transparent), url(/svgNoise.svg);
		filter: contrast(130%) brightness(400%);
	}
</style>
