<script lang="ts">
	let { title, value = $bindable() } = $props();

	function titleToId(title: string): string {
		return title.replaceAll(' ', '-');
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
			class="button-checkbox relative h-6 cursor-default rounded-full data-[state=checked]:bg-primary bg-border dark:border-primary dark:border-2 transition-all duration-100 hover:cursor-pointer hover:shadow-lg"
			id={titleToId(title)}
			aria-labelledby="{titleToId(title)}-label"
			onclick={() => {
				value = !value;
			}}
			data-state={value ? 'checked' : 'unchecked'}
		>
			<span
				class="thumb block rounded-full bg-background dark:bg-primary dark:data-[state=checked]:bg-background transition"
				data-state={value ? 'checked' : 'unchecked'}
			></span>
		</button>
		<input type="hidden" bind:value />
	</div>
</form>

<style>
	.button-checkbox {
		--w: 2.3rem;
		--padding: 2px;
		width: var(--w);
	}

	.thumb {
		--size: 1rem;
		width: var(--size);
		height: var(--size);
		transform: translateX(var(--padding));
	}

	:global([data-state='checked']) .thumb {
		transform: translateX(calc(var(--w) - var(--size) - var(--padding) - 3px));
	}
</style>
