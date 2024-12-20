<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import Button from '$components/ui/Button.svelte';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();
</script>

<div class="h-full flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-sm">
	<form action="?/login" method="post" class="flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<span>E-Mail</span>
			<input
				class="border-2 rounded-xl p-2"
				name="email"
				title="E-Mail"
				type="email"
				placeholder="mail@example.com"
			/>
		</div>
		<div class="flex flex-col gap-2">
			<span>Password</span>
			<input
				class="border-2 rounded-xl p-2"
				name="password"
				title="Password"
				type="password"
				placeholder="password"
			/>
		</div>
		{#if form?.fail}
			<div class="variant-soft-error px-4 py-2 mb-2 rounded-token">
				{form.message}
			</div>
		{/if}
		<Button type="submit" label={'Login'}></Button>
	</form>
</div>
