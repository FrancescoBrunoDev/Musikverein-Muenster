import { error, json } from '@sveltejs/kit';

async function getExhibitions({ locale }: { locale: Locales }) {
	let exhibitions: exhibitionMarkdown[] = [];

	const paths = import.meta.glob('/src/routes/[locale]/exhibitions/markdown/**/*.md', {
		eager: true
	});

	for (const path in paths) {
		const file = paths[path];
		// Verifica se il file appartiene alla locale corretta
		if (path.includes(`/${locale}/`)) {
			const slug = path.split('/').at(-1)?.replace('.md', '');

			if (file && typeof file === 'object' && 'metadata' in file && slug) {
				const metadata = file.metadata as Omit<exhibitionMarkdown, 'slug'>;
				const exhibition = { ...metadata, slug } satisfies exhibitionMarkdown;
				exhibition.published && exhibitions.push(exhibition);
			}
		}
	}

	exhibitions = exhibitions.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	return exhibitions;
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

		const exhibitions = await getExhibitions(params);
		return json(exhibitions);
	} catch (err) {
		throw error(500, 'Error fetching exhibitions');
	}
}
