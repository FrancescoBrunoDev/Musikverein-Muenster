<script lang="ts">
	export let value: Locales;
	export let handleLocaleChange: any;
</script>

<button
	on:click={() => {
		handleLocaleChange();
	}}
	aria-label="Toggle italic"
	class="h-10 w-10 rounded-xl bg-primary text-background transition-all hover:scale-hover hover:drop-shadow-xl"
>
	{value === 'en' ? 'de' : 'en'}
</button>
