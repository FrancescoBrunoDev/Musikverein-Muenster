import { json } from '@sveltejs/kit';


async function getImagesUrl(exibitionTitle: string, galleryNumber: string) {
	try {
		const imageModules = import.meta.glob('/static/exibitions/*/*/*.{jpg,jpeg,png,gif}');
		const images = [];

		for (const path in imageModules) {
			const parts = path.split('/');
			const exibition = parts[parts.length - 3];
			const gallery = parts[parts.length - 2];

			if (exibition === exibitionTitle && gallery === galleryNumber) {
				const imagePath = path.replace('/static', ''); // adjust this based on your public path
				images.push(imagePath);
			}
		}

		return images;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

interface RequestParams {
	exibitionTitle: string;
	galleryNumber: string;
}

interface Request {
	params: RequestParams;
}

export async function GET(request: Request): Promise<Response> {
	try {
		const { exibitionTitle, galleryNumber } = request.params;
		const images = await getImagesUrl(exibitionTitle, galleryNumber);
		return json(images);
	} catch (error) {
		throw error;
	}
}