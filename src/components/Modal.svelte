<script lang="ts">
	import Portal from '$components/ui/Portal.svelte';
	import { fly } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';
	import { Minimize2 } from 'lucide-svelte';
	import { showModal } from '$stores/storeGeneral';
	import { cn } from '$lib/utils';
	import Button from '$components/ui/Button.svelte';

	let { children } = $props();

	function closeModal() {
		$showModal = false;
	}
</script>

<Portal>
	{#if $showModal}
		<div
			in:fly={{ duration: 300, opacity: 0, easing: quadInOut }}
			out:fly={{ y: -20, duration: 300, opacity: 0, easing: quadInOut }}
			class={cn(
				'fixed inset-0 z-50 flex items-center justify-center bg-black/70 text-primary backdrop-blur-xl'
			)}
		>
			<div class="z-10 grid w-full justify-items-stretch gap-2 px-2 md:w-3/4 md:px-0">
				<div class="flex justify-end">
					<Button action={closeModal} light={true} icon={Minimize2} />
				</div>
				{@render children?.()}
			</div>
		</div>
	{/if}
</Portal>
