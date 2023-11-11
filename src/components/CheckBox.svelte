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
	<div class="flex items-center">
		<label
			class="pr-4 leading-none text-primary"
			for={titleToId(title)}
			id="{titleToId(title)}-label"
		>
			{title}
		</label>
		<button
			use:melt={$root}
			class="button-checkbox relative h-6 cursor-default rounded-full bg-primary transition-all duration-100 hover:cursor-pointer hover:shadow-lg data-[state=checked]:bg-primary-foreground"
			id={titleToId(title)}
			aria-labelledby="{titleToId(title)}-label"
		>
			<span
				class="thumb block rounded-full bg-secondary transition data-[state=checked]:bg-primary"
			/>
		</button>
		<input use:melt={$input} />
	</div>
</form>

<style>
	.button-checkbox {
		--w: 2.75rem;
		--padding: 0.125rem;
		width: var(--w);
	}

	.thumb {
		--size: 1.25rem;
		width: var(--size);
		height: var(--size);
		transform: translateX(var(--padding));
	}

	:global([data-state='checked']) .thumb {
		transform: translateX(calc(var(--w) - var(--size) - var(--padding)));
	}
</style>
