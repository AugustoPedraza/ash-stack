/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config = {
  stories: [
    '../svelte/**/*.stories.@(js|ts|svelte)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-svelte-csf',
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/svelte-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  }
};

export default config;
