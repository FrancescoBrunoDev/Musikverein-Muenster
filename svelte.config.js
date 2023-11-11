import { preprocessMeltUI } from '@melt-ui/pp';
import sequence from 'svelte-sequential-preprocessor';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
/** @type {import('@sveltejs/kit').Config}*/
const config = {
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
			$dataPrefetched: 'src/JsonDataMusiconnWorstCaseScenario',
		}
	},
	preprocess: sequence([vitePreprocess(), preprocessMeltUI()])
};
export default config;
