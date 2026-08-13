<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import Button from '$components/ui/Button.svelte';
	import { enhance } from '$app/forms';
	import { LL } from '$lib/i18n/i18n-svelte';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();
</script>

<div class="container flex h-full w-full max-w-sm flex-col justify-center">
	<form action="?/login" method="post" class="flex flex-col gap-4" use:enhance>
		<div class="flex flex-col gap-2">
			<span class="font-bold">{$LL.admin.email()}</span>
			<input
				class="bg-background dark:bg-dark-background rounded-xl border-2 p-2"
				name="email"
				title={$LL.admin.email()}
				type="email"
				placeholder={$LL.admin.emailPlaceholder()}
			/>
		</div>
		<div class="flex flex-col gap-2">
			<span class="font-bold">{$LL.admin.password()}</span>
			<input
				class="bg-background dark:bg-dark-background rounded-xl border-2 p-2"
				name="password"
				title={$LL.admin.password()}
				type="password"
				placeholder={$LL.admin.passwordPlaceholder()}
			/>
		</div>
		{#if form?.fail}
			<div class="variant-soft-error rounded-token mb-2 px-4 py-2">
				{form.message}
			</div>
		{/if}
		<Button type="submit" label={$LL.admin.login()}></Button>
	</form>
</div>
