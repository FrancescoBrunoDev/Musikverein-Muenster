<script lang="ts">
	import { createSwitch, melt } from '@melt-ui/svelte';
	import { createEventDispatcher } from 'svelte';
	export let title: string;

	const dispatch = createEventDispatcher();

	function titleToId(title: string): string {
		return title.replaceAll(' ', '-');
	}

	const {
		elements: { root, input },
		states: { checked }
	} = createSwitch();

	$: {
		dispatch('change', $checked);
	}
</script>

<form class="justify-self-end">
	<div class="flex items-center rounded-xl p-2">
		<label
			class="w-40 pr-4 text-right text-sm font-normal leading-none"
			for={titleToId(title)}
			id="{titleToId(title)}-label"
		>
			{title}
		</label>
		<button
			use:melt={$root}
			class="button-checkbox relative h-6 cursor-default rounded-full bg-destructive transition-all duration-100 hover:cursor-pointer hover:shadow-lg data-[state=checked]:bg-green-600 dark:bg-red-900 dark:data-[state=checked]:bg-green-700"
			id={titleToId(title)}
			aria-labelledby="{titleToId(title)}-label"
		>
			<span
				class="thumb block rounded-full bg-background transition data-[state=checked]:bg-primary"
			></span>
		</button>
		<input use:melt={$input} />
	</div>
</form>

<style>
	.button-checkbox {
		--w: 2rem;
		--padding: 0.18rem;
		width: var(--w);
	}

	.thumb {
		--size: 1rem;
		width: var(--size);
		height: var(--size);
		transform: translateX(var(--padding));
	}

	:global([data-state='checked']) .thumb {
		transform: translateX(calc(var(--w) - var(--size) - var(--padding)));
	}
</style>
