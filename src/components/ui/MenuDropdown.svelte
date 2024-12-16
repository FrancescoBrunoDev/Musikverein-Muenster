<script lang="ts">
	import { fly } from 'svelte/transition';
	import Button from '$components/ui/Button.svelte';
	import { cn } from '$lib/utils';

	let { children, label = null, icon, direction = 'bottom' } = $props();
	let isOpen = $state(false);

	function handleClick() {
		isOpen = !isOpen;
	}

	$effect(() => {
		if (isOpen) {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					event.target instanceof Element &&
					!event.target.closest('#menu-dropdown-' + direction)
				) {
					isOpen = false;
				}
			};
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});

	let height = $state(0);
	$effect(() => {
		if (isOpen) {
			const dropdown = document.getElementById('dropdown');
			if (dropdown) {
				height = dropdown.clientHeight;
			}
		} else {
			height = 0;
		}
	});

	const Icon = $derived(icon);
</script>

<div class="relative" id={'menu-dropdown-' + direction}>
	<Button {label} icon={Icon} action={handleClick} />

	{#if isOpen}
		<div
			id="dropdown"
			class={cn(
				`${direction == 'top' && `-top-[${height + 10}px]`} rounded-xl p-2 z-50 divide-y bg-background shadow-primary dark:border-2 drop-shadow-xl absolute right-0`,
				{
					'top-14 -right-2': direction === 'bottom'
				}
			)}
			transition:fly={{ duration: 150, y: -10 }}
		>
			{@render children?.()}
		</div>
	{/if}
</div>
