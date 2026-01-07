<script>
  /**
   * Address Autocomplete Recipe
   * Search with suggestions, structured address data, and manual entry fallback.
   *
   * Uses: Button, Input
   */
  import { mockSubmit } from '../../../lib/mock/mockApi.js';
  import { Button, Input } from '../../ui';

  // Mock address suggestions
  const mockAddresses = [
    { id: '1', display: '123 Main Street, New York, NY 10001', street: '123 Main Street', city: 'New York', state: 'NY', zip: '10001', country: 'US' },
    { id: '2', display: '456 Oak Avenue, Los Angeles, CA 90001', street: '456 Oak Avenue', city: 'Los Angeles', state: 'CA', zip: '90001', country: 'US' },
    { id: '3', display: '789 Pine Road, Chicago, IL 60601', street: '789 Pine Road', city: 'Chicago', state: 'IL', zip: '60601', country: 'US' },
    { id: '4', display: '321 Elm Boulevard, Houston, TX 77001', street: '321 Elm Boulevard', city: 'Houston', state: 'TX', zip: '77001', country: 'US' },
    { id: '5', display: '654 Maple Lane, Phoenix, AZ 85001', street: '654 Maple Lane', city: 'Phoenix', state: 'AZ', zip: '85001', country: 'US' },
    { id: '6', display: '987 Cedar Court, Philadelphia, PA 19101', street: '987 Cedar Court', city: 'Philadelphia', state: 'PA', zip: '19101', country: 'US' }
  ];

  // State
  let searchQuery = $state('');
  let suggestions = $state([]);
  let loading = $state(false);
  let showSuggestions = $state(false);
  let showManualEntry = $state(false);
  let highlightedIndex = $state(0);

  // Selected/Manual address
  let selectedAddress = $state(null);
  let manualAddress = $state({
    street: '',
    apt: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  // Debounce timer
  let debounceTimer = null;

  // State dropdown
  let showStateDropdown = $state(false);

  const states = [
    { value: '', label: 'Select state' },
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
  ];

  async function searchAddresses(query) {
    if (!query.trim()) {
      suggestions = [];
      return;
    }

    loading = true;

    // Simulate API call with delay
    await mockSubmit(() => {
      const q = query.toLowerCase();
      return mockAddresses.filter(a =>
        a.display.toLowerCase().includes(q) ||
        a.street.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.zip.includes(q)
      );
    }, 300);

    // Filter mock results
    const q = query.toLowerCase();
    suggestions = mockAddresses.filter(a =>
      a.display.toLowerCase().includes(q) ||
      a.street.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.zip.includes(q)
    );

    loading = false;
  }

  function handleInput(e) {
    searchQuery = e.target.value;
    showSuggestions = true;
    highlightedIndex = 0;

    // Debounce search
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchAddresses(searchQuery);
    }, 200);
  }

  function selectAddress(address) {
    selectedAddress = address;
    searchQuery = address.display;
    showSuggestions = false;
    showManualEntry = false;
  }

  function handleKeydown(e) {
    if (!showSuggestions) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightedIndex = Math.min(highlightedIndex + 1, suggestions.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedIndex = Math.max(highlightedIndex - 1, 0);
    } else if (e.key === 'Enter' && suggestions[highlightedIndex]) {
      e.preventDefault();
      selectAddress(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      showSuggestions = false;
    }
  }

  function handleBlur() {
    // Delay to allow click on suggestions
    setTimeout(() => {
      showSuggestions = false;
    }, 200);
  }

  function clearAddress() {
    selectedAddress = null;
    searchQuery = '';
    manualAddress = { street: '', apt: '', city: '', state: '', zip: '', country: 'US' };
  }

  function toggleManualEntry() {
    showManualEntry = !showManualEntry;
    if (showManualEntry) {
      selectedAddress = null;
      searchQuery = '';
    }
  }

  function saveManualAddress() {
    selectedAddress = {
      id: 'manual',
      display: `${manualAddress.street}${manualAddress.apt ? ', ' + manualAddress.apt : ''}, ${manualAddress.city}, ${manualAddress.state} ${manualAddress.zip}`,
      ...manualAddress
    };
    showManualEntry = false;
  }

  const manualValid = $derived(
    manualAddress.street.trim() &&
    manualAddress.city.trim() &&
    manualAddress.state &&
    manualAddress.zip.trim()
  );

  const selectedStateLabel = $derived(() => {
    const found = states.find(s => s.value === manualAddress.state);
    return found ? found.label : 'Select state';
  });

  function selectState(value) {
    manualAddress.state = value;
    showStateDropdown = false;
  }
</script>

<div class="h-full bg-background overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-foreground mb-2">Address Autocomplete</h1>
      <p class="text-muted-foreground text-sm">Search for addresses with suggestions and manual entry fallback.</p>
    </div>

    <div class="flex flex-col gap-6">
      {#if !showManualEntry}
        <!-- Autocomplete Input -->
        <div class="flex flex-col gap-1.5">
          <span class="text-sm font-medium text-foreground">Delivery Address</span>

          <div class="relative">
            <div class="flex items-center gap-2 px-3 h-12 border border-border-strong rounded-lg bg-background focus-within:border-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-disabled shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                style="all: unset; flex: 1; color: inherit; font: inherit;"
                class="text-foreground"
                placeholder="Start typing an address..."
                value={searchQuery}
                oninput={handleInput}
                onkeydown={handleKeydown}
                onblur={handleBlur}
                onfocus={() => searchQuery && (showSuggestions = true)}
              />
              {#if loading}
                <span class="loading loading-spinner loading-xs text-primary"></span>
              {:else if searchQuery}
                <button
                  type="button"
                  class="p-1 hover:bg-surface-sunken rounded"
                  onclick={clearAddress}
                  aria-label="Clear"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              {/if}
            </div>

            <!-- Suggestions Dropdown -->
            {#if showSuggestions && (suggestions.length > 0 || searchQuery)}
              <div class="absolute top-full left-0 right-0 mt-1 bg-background border border-border-strong rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {#each suggestions as address, i}
                  <button
                    type="button"
                    class="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-surface-sunken transition-colors
                      {i === highlightedIndex ? 'bg-surface-sunken' : ''}"
                    onclick={() => selectAddress(address)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-disabled shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-foreground">{address.street}</p>
                      <p class="text-xs text-muted-foreground">{address.city}, {address.state} {address.zip}</p>
                    </div>
                  </button>
                {:else}
                  <div class="px-3 py-4 text-center">
                    <p class="text-sm text-muted-foreground mb-2">No addresses found</p>
                    <button
                      type="button"
                      class="text-sm text-primary hover:underline"
                      onclick={toggleManualEntry}
                    >
                      Enter address manually
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>

          <button
            type="button"
            class="text-xs text-primary hover:underline self-start"
            onclick={toggleManualEntry}
          >
            Can't find your address? Enter manually
          </button>
        </div>
      {:else}
        <!-- Manual Entry Form -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-foreground">Enter Address Manually</span>
            <button
              type="button"
              class="text-xs text-primary hover:underline"
              onclick={toggleManualEntry}
            >
              Search instead
            </button>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs text-muted-foreground" for="street">Street Address</label>
            <Input
              id="street"
              type="text"
              placeholder="123 Main Street"
              bind:value={manualAddress.street}
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs text-muted-foreground" for="apt">Apt, Suite, Unit (optional)</label>
            <Input
              id="apt"
              type="text"
              placeholder="Apt 4B"
              bind:value={manualAddress.apt}
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs text-muted-foreground" for="city">City</label>
              <Input
                id="city"
                type="text"
                placeholder="New York"
                bind:value={manualAddress.city}
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <span class="text-xs text-muted-foreground">State</span>
              <div class="relative">
                <button
                  type="button"
                  class="w-full flex items-center justify-between px-3 py-2.5 border border-border-strong rounded-lg bg-background text-left hover:border-primary transition-colors"
                  onclick={() => showStateDropdown = !showStateDropdown}
                >
                  <span class="{manualAddress.state ? 'text-foreground' : 'text-muted-foreground'}">
                    {selectedStateLabel()}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-muted-foreground transition-transform {showStateDropdown ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {#if showStateDropdown}
                  <div class="absolute top-full left-0 right-0 mt-1 bg-background border border-border-strong rounded-lg shadow-lg z-20 overflow-hidden">
                    <div class="max-h-48 overflow-y-auto">
                      {#each states.slice(1) as state}
                        <button
                          type="button"
                          class="w-full px-3 py-2 text-left text-sm transition-colors
                            {manualAddress.state === state.value ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-surface-sunken'}"
                          onclick={() => selectState(state.value)}
                        >
                          {state.label}
                        </button>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs text-muted-foreground" for="zip">ZIP Code</label>
            <Input
              id="zip"
              type="text"
              class="max-w-32"
              placeholder="10001"
              bind:value={manualAddress.zip}
              maxlength="10"
            />
          </div>

          <Button
            variant="primary"
            fullWidth
            onclick={saveManualAddress}
            disabled={!manualValid}
          >
            Use This Address
          </Button>
        </div>
      {/if}

      <!-- Selected Address Display -->
      {#if selectedAddress}
        <div class="p-4 bg-success/10 border border-success/30 rounded-lg">
          <div class="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <div class="flex-1">
              <p class="text-sm font-medium text-foreground">{selectedAddress.street}</p>
              {#if selectedAddress.apt}
                <p class="text-sm text-muted-foreground">{selectedAddress.apt}</p>
              {/if}
              <p class="text-sm text-muted-foreground">
                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
              </p>
            </div>
            <button
              type="button"
              class="text-xs text-primary hover:underline"
              onclick={clearAddress}
            >
              Change
            </button>
          </div>
        </div>
      {/if}

      <!-- Structured Data Output -->
      {#if selectedAddress}
        <div class="p-4 bg-surface-sunken rounded-lg">
          <h3 class="text-sm font-medium text-foreground mb-2">Structured Address Data</h3>
          <pre class="text-xs text-muted-foreground overflow-x-auto">{JSON.stringify({
            street: selectedAddress.street,
            apt: selectedAddress.apt || null,
            city: selectedAddress.city,
            state: selectedAddress.state,
            zip: selectedAddress.zip,
            country: selectedAddress.country
          }, null, 2)}</pre>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- Click outside handler for state dropdown -->
{#if showStateDropdown}
  <button
    class="fixed inset-0 z-10"
    onclick={() => showStateDropdown = false}
    aria-label="Close dropdown"
  ></button>
{/if}
