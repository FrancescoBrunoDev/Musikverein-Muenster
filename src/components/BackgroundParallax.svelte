<script lang="ts">
	import { onMount } from 'svelte';

	let background: HTMLElement;
	let animationFrame: number | null = null;
	let currentX = 0;
	let currentY = 0;
	let targetX = 0;
	let targetY = 0;
	let isMouseDevice = false;

	type Layer = {
		el: HTMLElement;
		speed: number;
		tilt: number;
		focusPoint: number | null;
		maxBlur: number;
		minBlur: number;
		useTwBlur: boolean;
	};

	let layers: Layer[] = [];

	let { children } = $props();

	// Lerp function for smooth interpolation
	const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

	const applyFrame = () => {
		currentX = lerp(currentX, targetX, 0.1);
		currentY = lerp(currentY, targetY, 0.02);

		for (const layer of layers) {
			const xOffset = currentX * layer.speed;
			const yOffset = currentY * layer.speed;
			const tiltX = currentY * layer.tilt;
			const tiltY = -currentX * layer.tilt;

			let filter = '';
			if (layer.focusPoint !== null) {
				const blur = Math.max(layer.minBlur, Math.abs(currentX - layer.focusPoint) * layer.maxBlur);
				filter = `blur(${blur}px)`;
			}

			layer.el.style.transform = `translate(${xOffset}px, ${yOffset}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

			// ponytail: compose with Tailwind's filter chain (brightness-*) via --tw-blur,
			// otherwise a direct `filter: blur()` would wipe the brightness dimming
			if (layer.useTwBlur) {
				layer.el.style.setProperty('--tw-blur', filter);
			} else {
				layer.el.style.filter = filter;
			}
		}

		// ponytail: stop the loop once the lerp settles, restart on next mousemove
		if (Math.abs(currentX - targetX) < 0.001 && Math.abs(currentY - targetY) < 0.001) {
			animationFrame = null;
		} else {
			animationFrame = requestAnimationFrame(applyFrame);
		}
	};

	const handleMouseMove = (e: MouseEvent) => {
		targetX = (e.clientX / window.innerWidth - 0.5) * 2;
		targetY = (e.clientY / window.innerHeight - 0.5) * 2;

		if (animationFrame === null) {
			animationFrame = requestAnimationFrame(applyFrame);
		}
	};

	onMount(() => {
		isMouseDevice = window.matchMedia('(pointer: fine)').matches;
		if (!isMouseDevice) return;

		layers = Array.from(background.querySelectorAll<HTMLElement>('[data-speed]')).map((el) => ({
			el,
			speed: Number(el.dataset.speed),
			tilt: Number(el.dataset.tilt || '0'),
			focusPoint: el.hasAttribute('data-focus-point') ? Number(el.dataset.focusPoint) : null,
			maxBlur: Number(el.dataset.maxBlur) || 5,
			minBlur: el.hasAttribute('data-can-focus') ? 0 : 1,
			useTwBlur: getComputedStyle(el).filter !== 'none'
		}));

		// ponytail: cursor position can't be read before a mousemove, so apply one frame
		// with the centered default to set the initial focus blur
		applyFrame();

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			if (animationFrame !== null) cancelAnimationFrame(animationFrame);
		};
	});
</script>

<div bind:this={background} class="fixed inset-0 scale-[1.01]">
	{@render children?.()}
</div>


