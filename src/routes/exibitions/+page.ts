export async function load({ fetch }) {
	const response = await fetch('api/getExibitionMarkdown');
	const exibitions: ExibitionMarkdown[] = await response.json();
	return { exibitions };
}
