import { preprocessMeltUI } from '@melt-ui/pp';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import sequence from 'svelte-sequential-preprocessor';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	layout: {
		_: 'src/routes/[locale]/exibitions/mdsvex.svelte'
	}
};

/** @type {import('@sveltejs/kit').Config}*/
const config = {
	extensions: ['.svelte', '.md'],
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$stores: 'src/stores',
			$utils: 'src/utils',
			$components: 'src/components',
			$tailwind: 'src/globals.css',
			$lib: 'src/lib',
			$static: 'src/static',
			$routes: 'src/routes',
			$states: 'src/states'
		}
	},
	preprocess: sequence([vitePreprocess(), preprocessMeltUI(), mdsvex(mdsvexOptions)])
};
export default config;
