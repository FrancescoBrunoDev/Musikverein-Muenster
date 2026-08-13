<script lang="ts">
	let { children } = $props();
</script>

<div class="container mx-auto mt-10">
	{@render children?.()}
</div>
