<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<script lang="ts" module>
	import { img, h1, h2, h3, p, ul, ol, blockquote, li } from '$components/markdown';
	export { img, h1, h2, h3, p, ul, ol, blockquote, li };
</script>

{@render children?.()}
