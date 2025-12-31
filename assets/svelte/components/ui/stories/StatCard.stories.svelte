<script context="module">
  import StatCard from '../StatCard.svelte';

  export const meta = {
    title: 'Components/Data Visualization/StatCard',
    component: StatCard,
    tags: ['autodocs'],
    argTypes: {
      format: {
        control: 'select',
        options: ['number', 'currency', 'percent', 'custom']
      },
      iconColor: {
        control: 'select',
        options: ['primary', 'success', 'warning', 'error', 'info']
      },
      size: {
        control: 'select',
        options: ['sm', 'md', 'lg']
      }
    }
  };
</script>

<script>
  import { Story, Template } from '@storybook/addon-svelte-csf';

  const usersIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  const dollarIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
  const chartIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;

  const sparklineData = [12, 15, 8, 22, 18, 25, 30, 28, 35, 32, 40, 38];
</script>

<Template let:args>
  <StatCard {...args} />
</Template>

<Story name="Basic" args={{
  label: 'Total Users',
  value: 12847
}} />

<Story name="With Icon" args={{
  label: 'Total Users',
  value: 12847,
  icon: usersIcon,
  iconColor: 'primary'
}} />

<Story name="With Trend Up" args={{
  label: 'Revenue',
  value: 48250,
  previousValue: 42100,
  format: 'currency',
  icon: dollarIcon,
  iconColor: 'success'
}} />

<Story name="With Trend Down" args={{
  label: 'Bounce Rate',
  value: 32,
  previousValue: 28,
  format: 'percent',
  inverseTrend: true,
  iconColor: 'error'
}} />

<Story name="With Sparkline" args={{
  label: 'Page Views',
  value: 284721,
  previousValue: 256102,
  icon: chartIcon,
  iconColor: 'info',
  sparkline: sparklineData
}} />

<Story name="Currency Format" args={{
  label: 'Monthly Revenue',
  value: 125750.50,
  format: 'currency',
  decimals: 2,
  icon: dollarIcon,
  iconColor: 'success'
}} />

<Story name="Loading State" args={{
  label: 'Loading...',
  loading: true
}} />

<Story name="Dashboard Grid">
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
    <StatCard
      label="Total Users"
      value={12847}
      previousValue={11234}
      icon={usersIcon}
      iconColor="primary"
    />
    <StatCard
      label="Revenue"
      value={48250}
      previousValue={42100}
      format="currency"
      icon={dollarIcon}
      iconColor="success"
    />
    <StatCard
      label="Conversion Rate"
      value={3.2}
      previousValue={2.8}
      format="percent"
      suffix="%"
      iconColor="info"
    />
    <StatCard
      label="Page Views"
      value={284721}
      previousValue={256102}
      icon={chartIcon}
      sparkline={sparklineData}
      iconColor="warning"
    />
  </div>
</Story>
