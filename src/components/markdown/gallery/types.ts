export type Gallery = {
	id?: number;
	title: string;
	cover: string;
	caption?: string;
	images?: { src: string; caption?: string }[];
};
