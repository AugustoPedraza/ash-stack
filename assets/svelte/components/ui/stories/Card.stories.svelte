<script context="module">
  import Card from '../Card.svelte';
  import Button from '../Button.svelte';

  export const meta = {
    title: 'Components/Layout/Card',
    component: Card,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: 'select',
        options: ['default', 'outlined', 'elevated']
      },
      padding: {
        control: 'select',
        options: ['none', 'sm', 'md', 'lg']
      },
      title: { control: 'text' },
      description: { control: 'text' }
    }
  };
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <Card {...args}>
    <p>Card content goes here. This is a sample paragraph to demonstrate the card layout.</p>
  </Card>
</Template>

<Story name="Default" args={{}} />

<Story name="With Title" args={{ title: 'Card Title' }} />

<Story name="With Title and Description" args={{
  title: 'Card Title',
  description: 'This is a helpful description'
}} />

<Story name="Outlined" args={{ variant: 'outlined', title: 'Outlined Card' }} />

<Story name="Elevated" args={{ variant: 'elevated', title: 'Elevated Card' }} />

<Story name="With Actions">
  <Card title="Card with Actions">
    <p>Card content with action buttons in the footer.</p>
    <svelte:fragment slot="actions">
      <Button variant="secondary" size="sm">Cancel</Button>
      <Button variant="primary" size="sm">Save</Button>
    </svelte:fragment>
  </Card>
</Story>

<Story name="With Header Slot">
  <Card>
    <svelte:fragment slot="header">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0;">Custom Header</h3>
        <Button variant="ghost" size="sm">Edit</Button>
      </div>
    </svelte:fragment>
    <p>Card with a custom header slot.</p>
  </Card>
</Story>

<Story name="Padding Variants">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <Card padding="none" title="No Padding">
      <p style="margin: 0;">Content with no padding</p>
    </Card>
    <Card padding="sm" title="Small Padding">
      <p style="margin: 0;">Content with small padding</p>
    </Card>
    <Card padding="md" title="Medium Padding">
      <p style="margin: 0;">Content with medium padding</p>
    </Card>
    <Card padding="lg" title="Large Padding">
      <p style="margin: 0;">Content with large padding</p>
    </Card>
  </div>
</Story>
