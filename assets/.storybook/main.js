/** @type { import('@storybook/sveltekit').StorybookConfig } */
const config = {
  stories: [
    '../svelte/**/*.mdx',
    '../svelte/**/*.stories.@(js|ts|svelte)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-svelte-csf',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  staticDirs: ['../static']
};

export default config;
