<script context="module">
  import Button from '../Button.svelte';

  export const meta = {
    title: 'Components/Form/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: 'select',
        options: ['primary', 'secondary', 'ghost', 'danger']
      },
      size: {
        control: 'select',
        options: ['sm', 'md', 'lg']
      },
      disabled: { control: 'boolean' },
      loading: { control: 'boolean' },
      fullWidth: { control: 'boolean' }
    }
  };
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <Button {...args}>Button</Button>
</Template>

<Story name="Primary" args={{ variant: 'primary' }} />

<Story name="Secondary" args={{ variant: 'secondary' }} />

<Story name="Ghost" args={{ variant: 'ghost' }} />

<Story name="Danger" args={{ variant: 'danger' }} />

<Story name="Small" args={{ size: 'sm' }} />

<Story name="Large" args={{ size: 'lg' }} />

<Story name="Loading" args={{ loading: true }} />

<Story name="Disabled" args={{ disabled: true }} />

<Story name="Full Width" args={{ fullWidth: true }} />

<Story name="All Variants">
  <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="danger">Danger</Button>
  </div>
</Story>

<Story name="All Sizes">
  <div style="display: flex; gap: 1rem; align-items: center;">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
</Story>
