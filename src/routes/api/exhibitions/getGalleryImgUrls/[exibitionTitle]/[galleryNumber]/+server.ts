import { json } from '@sveltejs/kit';

async function getImagesUrl(exhibitionTitle: string, galleryNumber: string) {
	try {
		const imageModules = import.meta.glob('/static/exhibitions/*/*/*.{jpg,jpeg,png,gif}');
		const images = [];

		for (const path in imageModules) {
			const parts = path.split('/');
			const exhibition = parts[parts.length - 3];
			const gallery = parts[parts.length - 2];

			if (exhibition === exhibitionTitle && gallery === galleryNumber) {
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
	exhibitionTitle: string;
	galleryNumber: string;
}

interface Request {
	params: RequestParams;
}

export async function GET(request: Request): Promise<Response> {
	try {
		const { exhibitionTitle, galleryNumber } = request.params;
		const images = await getImagesUrl(exhibitionTitle, galleryNumber);
		return json(images);
	} catch (error) {
		throw error;
	}
}
