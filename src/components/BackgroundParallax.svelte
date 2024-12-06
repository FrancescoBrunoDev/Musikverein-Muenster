<script lang="ts">
    import { onMount } from 'svelte';
    
    let background: HTMLElement;
    let animationFrame: number;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    // Lerp function for smooth interpolation
    const lerp = (start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
    };

    const updatePosition = () => {
        currentX = lerp(currentX, targetX, 0.05);
        currentY = lerp(currentY, targetY, 0.0);

        if (background) {
            background.querySelectorAll('[data-speed]').forEach((element) => {
                const speed = Number(element.getAttribute('data-speed'));
                const tiltIntensity = Number(element.getAttribute('data-tilt') || '0');
                const xOffset = currentX * speed;
                const yOffset = currentY * speed;
                
                const tiltX = currentY * tiltIntensity;
                const tiltY = -currentX * tiltIntensity;
                
                const focusPoint = element.getAttribute('data-focus-point');
                let filterStyle = '';
                
                if (focusPoint !== null) {
                    const distanceFromFocus = Math.abs(currentX - Number(focusPoint));
                    const maxBlur = 5;
                    const minBlur = 1;
                    const blur = Math.max(minBlur, distanceFromFocus * maxBlur);
                    filterStyle = `blur(${blur}px)`;
                }
                
                (element as HTMLElement).style.transform = `translate(${xOffset}px, ${yOffset}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
                (element as HTMLElement).style.filter = filterStyle;
            });
        }
        
        animationFrame = requestAnimationFrame(updatePosition);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    onMount(() => {
        window.addEventListener('mousemove', handleMouseMove);
        animationFrame = requestAnimationFrame(updatePosition);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrame);
        };
    });
</script>

<div class="fixed inset-0 overflow-hidden" style="perspective: 1000px">
    <div bind:this={background} class="fixed h-[102%] w-[102%] left-[-1%] top-[-1%]">
        <slot />
    </div>
</div>

<style>
    :global([data-speed]) {
        transition: filter 0.3s ease-out;
        will-change: transform, filter;
    }
</style>
