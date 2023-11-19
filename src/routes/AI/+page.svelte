<script lang="ts">
	interface AnswerType {
		question: string;
		answer: string;
	}
	let question: string = '';
	let answers: { [id: string]: AnswerType } = {};
	let id: number = 0;

	async function sendQuery() {
		const currentId = id.toString();
		id++;
		answers[currentId] = { question: '', answer: '' };

		const response = await fetch('http://localhost:11435/api/generate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ model: 'openchat', prompt: question })
		});

		if (!response.body) {
			throw new Error('Response body is null');
		}

		const reader: ReadableStreamDefaultReader = response.body.getReader();
		let chunks = '';
		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			chunks += new TextDecoder('utf-8').decode(value);
			if (chunks.endsWith('\n')) {
				const lines = chunks.split('\n').filter(Boolean);
				lines.forEach((line) => {
					const newAnswer = JSON.parse(line).response;
					answers[currentId].question = question;
					answers[currentId].answer = answers[currentId].answer
						? `${answers[currentId].answer}${newAnswer}`
						: newAnswer;
				});
				chunks = '';
			}
		}
		question = '';
	}
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center">
	<div class="mb-4 flex h-96 w-96 flex-col gap-2 overflow-auto p-4">
		{#each Object.values(answers) as { question, answer }}
			<p class="ml-3 rounded-xl rounded-tr-none bg-secondary p-2">{question}</p>
			<p class="mr-3 rounded-xl rounded-tl-none bg-primary p-2 text-background">{answer}</p>
		{/each}
	</div>
	<div class="flex w-96 gap-2 h-fit items-end">
		<input
			class="w-full rounded-xl px-2 min-h-[2.5rem]"
			bind:value={question}
			placeholder="Question"
			on:keydown={(e) => e.key === 'Enter' && sendQuery()}
		/>
		<button class="bg-primary rounded-xl px-2 h-10" on:click={sendQuery}>send</button>
	</div>
</div>
