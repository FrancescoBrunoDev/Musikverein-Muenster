<script>
	import * as config from '$lib/config';
	import LL from '$lib/i18n/i18n-svelte';
	import BackgroundParallax from '../components/BackgroundParallax.svelte';

	async function getExibitions() {
		const response = await fetch('/api/exibitions/getMarkdown');
		const exibitions = await response.json();
		return exibitions;
	}
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>
<BackgroundParallax>
	<div class="fixed inset-0 flex flex-col justify-end">
		<img
			data-speed="-2"
			data-tilt="-4"
			class="fixed h-full w-full bg-cover bg-center object-cover brightness-75"
			alt="Rathaussaal in Münster"
			src="img/bg.png"
		/>
		<img
			data-speed="1"
			data-tilt="0.5"
			data-focus-point="-0.8"
			class="fixed h-full w-full bg-cover bg-center object-cover brightness-75"
			alt="Rathaussaal in Münster"
			src="img/lamp_back.png"
		/>
		<img
			data-speed="5"
			data-tilt="2.5"
			data-focus-point="0"
			class="fixed h-full w-full bg-cover bg-center object-cover brightness-75"
			alt="Rathaussaal in Münster"
			src="img/lamp_middle.png"
		/>
		<img
			data-speed="20"
			data-tilt="10"
			data-focus-point="0.8"
			class="fixed h-full w-full bg-cover bg-center object-cover brightness-75"
			alt="Rathaussaal in Münster"
			src="img/lamp_fore.png"
		/>

		<div
			class="container z-10 flex w-full flex-col gap-12 px-10 pb-10 text-right font-bold text-white"
		>
			<h1
				class="z-10 w-full text-5xl md:text-8xl lg:text-8xl"
				data-focus-point="0.5"
				data-speed="-5"
				data-can-focus
				data-max-blur="2"
			>
				MusikVerein<br />Münster
			</h1>
			<div
				class="flex w-full items-center gap-6 text-5xl font-bold sm:text-6xl md:items-end md:text-7xl lg:text-8xl"
			>
				<div
					class="grid grid-cols-1"
					data-focus-point="-0.5"
					data-speed="5"
					data-can-focus
					data-max-blur="2"
				>
					<a class="transition-transform duration-75 hover:-translate-y-1" href="/timeline"
						>{$LL.navbar.timeline()}</a
					>

					<a class="group transition-transform duration-75 hover:-translate-y-1" href="/exibitions"
						>{$LL.navbar.exibitions()}</a
					>
					<ul class="pl-5">
						{#await getExibitions()}
							<div></div>{:then exibitions}
							{#each exibitions as exibition}
								<li class="text-xl transition-transform duration-75 hover:-translate-y-1">
									<a href="/exibitions/{exibition.slug}">{exibition.title}</a>
								</li>
							{/each}
						{/await}
					</ul>
				</div>
			</div>
		</div>
	</div>
</BackgroundParallax>
