import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Pretty Nice',
            customCss: [
              './src/styles/custom.css',
            ],
			social: {
				github: 'https://github.com/blaix/prettynice',
				mastodon: 'https://hachyderm.io/@blaix',
			},
			sidebar: [
				{
					label: 'The Basics',
					items: [
						{ label: 'Getting Started', link: '/basics/start/' },
						{ label: 'The Server', link: '/basics/server/' },
						{ label: 'Client-side Components', link: '/basics/client/' },
						{ label: 'Images and Styling', link: '/basics/assets/' },
						{ label: 'Forms', link: '/basics/forms/' },
					],
				},
			  {
					label: 'Next Steps',
					items: [
						{ label: 'The Elm Architecture', link: '/next/tea/' },
						{ label: 'Server-side Javascript', link: '/next/server-js/' },
						{ label: 'Client-side Javascript', link: '/next/client-js/' },
						{ label: 'Examples', link: '/next/examples/' },
					],
				},
			  {
					label: 'Guides',
                    autogenerate: { directory: 'guides' },
				},
			],
		}),
	],
  markdown: {
    rehypePlugins: [
      [ rehypeExternalLinks, {content: { type: 'text', value: ' ↗'}},
      ],
    ]
  },
});
