<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import Button from '$components/ui/Button.svelte';
	import { enhance } from '$app/forms';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();
</script>

<div class="container flex h-full w-full max-w-sm flex-col justify-center">
	<form action="?/login" method="post" class="flex flex-col gap-4" use:enhance>
		<div class="flex flex-col gap-2">
			<span class="font-bold">E-Mail</span>
			<input
				class="rounded-xl border-2 bg-background p-2"
				name="email"
				title="E-Mail"
				type="email"
				placeholder="mail@example.com"
			/>
		</div>
		<div class="flex flex-col gap-2">
			<span class="font-bold">Password</span>
			<input
				class="rounded-xl border-2 bg-background p-2"
				name="password"
				title="Password"
				type="password"
				placeholder="password"
			/>
		</div>
		{#if form?.fail}
			<div class="variant-soft-error rounded-token mb-2 px-4 py-2">
				{form.message}
			</div>
		{/if}
		<Button type="submit" label={'Login'}></Button>
	</form>
</div>
