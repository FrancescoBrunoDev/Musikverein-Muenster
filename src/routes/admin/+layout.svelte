<script lang="ts">
	let { children } = $props();
</script>

<main class="mt-10 container mx-auto">
	{@render children?.()}
</main>
