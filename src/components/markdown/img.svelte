<script lang="ts">
	export let src: string;
	export let alt: string;
</script>

<img class="rounded-lg" {src} {alt} loading="lazy" />
