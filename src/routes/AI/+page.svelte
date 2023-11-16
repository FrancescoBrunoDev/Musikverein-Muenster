<script lang="ts">
	let context: string = '';
	let question: string = '';
	let answers: { text: string; start: number; logit: number } = [
        { text: 'test', start: 0, logit: 0 }
    ];

	async function sendQuery() {
		if (context.trim() !== '' && question.trim() !== '') {
			const response = await fetch('http://localhost:8000/predict', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ context: [context], question: [question] })
			});
			const data: string[] = await response.json();
			console.log(data);
			answers = data.map(([text, start, logit]) => ({ text, start, logit }));
		}
	}
	function autoResize(textarea: EventTarget | null) {
		if (!textarea) return;
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	}
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center">
	<div class="mb-4 h-64 w-64 overflow-auto border p-4">
		{#each answers as answer (answer.text)}
			<div>{answer.text}</div>
		{/each}
	</div>
	<div class="flex w-64 flex-col gap-2">
		<textarea
			bind:value={context}
			on:input={(e) => autoResize(e.target)}
			class="w-full"
			placeholder="Context"
		></textarea>
		<input
			class="h-10 w-full"
			bind:value={question}
			placeholder="Question"
			on:keydown={(e) => e.key === 'Enter' && sendQuery()}
		/>
		<button on:click={sendQuery}>send</button>
	</div>
</div>
