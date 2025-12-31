<script context="module">
  import ProgressBar from '../ProgressBar.svelte';

  export const meta = {
    title: 'Components/Data Visualization/ProgressBar',
    component: ProgressBar,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: 'select',
        options: ['primary', 'success', 'warning', 'error', 'info']
      },
      size: {
        control: 'select',
        options: ['xs', 'sm', 'md', 'lg']
      },
      labelPosition: {
        control: 'select',
        options: ['inside', 'outside', 'top']
      }
    }
  };
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <ProgressBar {...args} />
</Template>

<Story name="Default" args={{ value: 60 }} />

<Story name="With Label" args={{ value: 60, showLabel: true }} />

<Story name="Variants">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <ProgressBar value={80} variant="primary" showLabel />
    <ProgressBar value={60} variant="success" showLabel />
    <ProgressBar value={40} variant="warning" showLabel />
    <ProgressBar value={20} variant="error" showLabel />
    <ProgressBar value={50} variant="info" showLabel />
  </div>
</Story>

<Story name="Sizes">
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <ProgressBar value={75} size="xs" showLabel labelPosition="outside" />
    <ProgressBar value={75} size="sm" showLabel labelPosition="outside" />
    <ProgressBar value={75} size="md" showLabel labelPosition="outside" />
    <ProgressBar value={75} size="lg" showLabel labelPosition="inside" />
  </div>
</Story>

<Story name="Striped" args={{ value: 65, striped: true }} />

<Story name="Striped Animated" args={{ value: 65, striped: true, stripedAnimated: true }} />

<Story name="Indeterminate" args={{ indeterminate: true }} />

<Story name="Segmented" args={{ value: 3, max: 5, segments: 5, showLabel: true, label: '3 of 5 steps' }} />

<Story name="With Description" args={{
  value: 75,
  showLabel: true,
  labelPosition: 'top',
  description: '75 of 100 tasks completed'
}} />

<Story name="Upload Progress">
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
      <span>document.pdf</span>
      <span>2.4 MB / 3.2 MB</span>
    </div>
    <ProgressBar value={75} variant="primary" size="sm" />
  </div>
</Story>

<Story name="Multi-step Form">
  <div style="max-width: 400px;">
    <ProgressBar
      value={2}
      max={4}
      segments={4}
      showLabel
      labelPosition="top"
      label="Step 2 of 4: Personal Info"
    />
  </div>
</Story>
