import { json, error } from '@sveltejs/kit';

async function getExibitions({ locale }: { locale: Locales }) {
	let exibitions: ExibitionMarkdown[] = [];

	const paths = import.meta.glob('/src/routes/[locale]/exibitions/markdown/**/*.md', { eager: true });
	console.log(paths);
	for (const path in paths) {
		const file = paths[path];
		// Verifica se il file appartiene alla locale corretta
		if (path.includes(`/${locale}/`)) {
			const slug = path.split('/').at(-1)?.replace('.md', '');

			if (file && typeof file === 'object' && 'metadata' in file && slug) {
				const metadata = file.metadata as Omit<ExibitionMarkdown, 'slug'>;
				const exibition = { ...metadata, slug } satisfies ExibitionMarkdown;
				exibition.published && exibitions.push(exibition);
			}
		}
	}

	exibitions = exibitions.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	return exibitions;
}

interface RequestParams {
	locale: Locales;
}

interface Request {
	params: RequestParams;
}

export async function GET(request: Request): Promise<Response> {
	try {
		const { params } = request;
		if (!params.locale) {
			throw error(400, 'Locale parameter is required');
		}

		const exibitions = await getExibitions(params);
		return json(exibitions);
	}
	catch (err) {
		throw error(500, 'Error fetching exhibitions');
	}
}