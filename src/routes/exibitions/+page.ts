export async function load({ fetch }) {
	const response = await fetch('api/exibitions/getMarkdown');
	const exibitions: ExibitionMarkdown[] = await response.json();
	return { exibitions };
}
