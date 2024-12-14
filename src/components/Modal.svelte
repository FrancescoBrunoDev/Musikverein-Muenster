<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut, cubicIn } from 'svelte/easing';
	import { Minimize2 } from 'lucide-svelte';
	import { showModal } from '$stores/storeGeneral';

	let modalElement: HTMLDivElement;

	onMount(async () => {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeydown);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeydown);
		}
	});

	$: {
		if ($showModal && modalElement) {
			document.body.appendChild(modalElement);
		} else if (modalElement && modalElement.parentNode === document.body) {
			document.body.removeChild(modalElement);
		}
	}

	function closeModal() {
		$showModal = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
</script>

{#if $showModal}
	<div
		bind:this={modalElement}
		transition:fade={{ duration: 300 }}
		class="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center backdrop-blur-xl backdrop-brightness-50"
	>
		<div
			in:fly={{ y: 100, duration: 400, easing: cubicOut }}
			out:fly={{ y: -50, duration: 300, easing: cubicIn }}
			class="z-10 grid w-full justify-items-stretch gap-2 px-2 md:w-3/4 md:px-0"
		>
			<button
				on:click={closeModal}
				class="flex h-8 w-8 items-center justify-center justify-self-end rounded-xl bg-background p-2 transition-all hover:scale-hover hover:drop-shadow-xl dark:bg-primary dark:text-background"
			>
				<Minimize2 />
			</button>
			<slot />
		</div>
	</div>
{/if}
