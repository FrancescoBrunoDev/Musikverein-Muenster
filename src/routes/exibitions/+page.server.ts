async function getexibitions() {
	let exibitions: ExibitionMarkdown[] = []

	const paths = import.meta.glob('/src/routes/exibitions/markdown/*.md', { eager: true })
	for (const path in paths) {
		const file = paths[path]
		const slug = path.split('/').at(-1)?.replace('.md', '')

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<ExibitionMarkdown, 'slug'>
			const exibition = { ...metadata, slug } satisfies ExibitionMarkdown
			exibition.published && exibitions.push(exibition)
		}
	}

	exibitions = exibitions.sort((first, second) =>
    new Date(second.date).getTime() - new Date(first.date).getTime()
	)

	return exibitions
}

export async function load() {
	const response = await getexibitions();
	const exibitions: ExibitionMarkdown[] = response;
	return { exibitions };
}
