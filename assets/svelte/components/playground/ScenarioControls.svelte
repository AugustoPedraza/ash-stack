<script>
  import { DropdownMenu } from 'bits-ui';
  import { currentScenario, scenarios } from '../../lib/mock/scenarios.js';

  const scenarioOptions = [
    { id: 'happy-path', label: 'Happy Path', description: 'Fast, no errors' },
    { id: 'slow-network', label: 'Slow Network', description: '2-5s delays' },
    { id: 'intermittent-errors', label: 'Intermittent Errors', description: '30% failure' },
    { id: 'always-error', label: 'Always Error', description: 'Test error states' },
    { id: 'empty-state', label: 'Empty State', description: 'No items' },
    { id: 'many-items', label: 'Many Items', description: '500+ items' }
  ];

  let dropdownOpen = $state(false);

  function selectScenario(scenarioId) {
    currentScenario.set(scenarioId);
    dropdownOpen = false;
  }

  const currentLabel = $derived(
    scenarioOptions.find(s => s.id === $currentScenario)?.label || 'Happy Path'
  );
</script>

<DropdownMenu.Root bind:open={dropdownOpen}>
  <DropdownMenu.Trigger class="btn btn-outline btn-sm gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
    {currentLabel}
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      class="z-50 min-w-56 rounded-lg border border-accent bg-base-100 p-1 shadow-lg"
      sideOffset={4}
    >
      {#each scenarioOptions as scenario}
        <DropdownMenu.Item
          class="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-muted focus:bg-muted focus:outline-none
            {$currentScenario === scenario.id ? 'bg-primary/10 text-primary' : ''}"
          onSelect={() => selectScenario(scenario.id)}
        >
          <div class="font-medium">{scenario.label}</div>
          <div class="text-xs text-muted-foreground">{scenario.description}</div>
        </DropdownMenu.Item>
      {/each}
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
