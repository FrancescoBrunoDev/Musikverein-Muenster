<script lang="ts">
	import Portal from '$components/ui/Portal.svelte';
	import { fly } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';
	import { Minimize2 } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import Button from '$components/ui/Button.svelte';

	let { children, isOpen = $bindable() } = $props();
</script>

<Portal>
	{#if isOpen}
		<div
			in:fly={{ duration: 300, opacity: 0, easing: quadInOut }}
			out:fly={{ y: -20, duration: 300, opacity: 0, easing: quadInOut }}
			class={cn(
				'fixed inset-0 z-50 flex items-center justify-center bg-black/20 text-primary backdrop-blur-3xl'
			)}
		>
			<div
				class="container z-10 grid w-full max-w-xl justify-items-stretch gap-2 px-2 md:w-3/4 md:px-0"
			>
				<div class="flex justify-end">
					<Button action={() => (isOpen = !isOpen)} light={true} icon={Minimize2} />
				</div>
				<div class="max-h-[80dvh]">
					{@render children?.()}
				</div>
			</div>
		</div>
	{/if}
</Portal>
