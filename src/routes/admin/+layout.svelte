<script lang="ts">
	let { children } = $props();
</script>

<main class="container mx-auto mt-10">
	{@render children?.()}
</main>
