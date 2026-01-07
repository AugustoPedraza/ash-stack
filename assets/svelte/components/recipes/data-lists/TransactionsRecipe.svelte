<script>
  /**
   * Transactions Recipe
   * Master/detail list with visual hierarchy, compact rows, consistent detail layout.
   * Uses AppHeader for consistent navigation pattern.
   *
   * Uses: AppHeader, IconButton, Button, Skeleton, Badge
   */
  import { mockFetch } from '../../../lib/mock/mockApi.js';
  import { AppHeader, IconButton, Button, Skeleton, Badge } from '../../ui';

  // Mock transaction data
  function generateTransactions() {
    const transactions = [
      { type: 'deposit', icon: 'income', description: 'Direct Deposit', merchant: 'Acme Corp', category: 'Income' },
      { type: 'payment', icon: 'shopping', description: 'Online Purchase', merchant: 'Amazon', category: 'Shopping' },
      { type: 'payment', icon: 'food', description: 'Restaurant', merchant: 'Chipotle', category: 'Food & Dining' },
      { type: 'transfer', icon: 'transfer', description: 'Transfer to Savings', merchant: 'Internal', category: 'Transfer' },
      { type: 'payment', icon: 'subscription', description: 'Subscription', merchant: 'Netflix', category: 'Entertainment' },
      { type: 'payment', icon: 'utilities', description: 'Utility Bill', merchant: 'PG&E', category: 'Bills' },
      { type: 'withdrawal', icon: 'atm', description: 'ATM Withdrawal', merchant: 'Chase ATM', category: 'Cash' },
      { type: 'deposit', icon: 'refund', description: 'Refund', merchant: 'Target', category: 'Refund' }
    ];

    const statuses = ['completed', 'pending', 'completed', 'completed', 'completed', 'failed', 'completed', 'completed'];

    return Array.from({ length: 20 }, (_, i) => {
      const base = transactions[i % transactions.length];
      const isIncome = base.type === 'deposit';
      return {
        id: `txn-${i + 1}`,
        ...base,
        amount: isIncome
          ? (Math.random() * 2000 + 500).toFixed(2)
          : -(Math.random() * 150 + 10).toFixed(2),
        date: new Date(2025, 0, 25 - i).toISOString(),
        status: statuses[i % statuses.length]
      };
    });
  }

  let transactions = $state([]);
  let loading = $state(true);
  let error = $state(null);
  let selectedTransaction = $state(null);

  $effect(() => {
    loadData();
  });

  async function loadData() {
    loading = true;
    error = null;
    const result = await mockFetch(generateTransactions);
    loading = false;
    if (result.error) {
      error = result.error.message;
      return;
    }
    transactions = result.data;
  }

  function openDetail(txn) {
    selectedTransaction = txn;
  }

  function closeDetail() {
    selectedTransaction = null;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function formatFullDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
  }

  function getDateLabel(type) {
    switch (type) {
      case 'deposit': return 'Received on';
      case 'payment': return 'Paid on';
      case 'transfer': return 'Transferred on';
      case 'withdrawal': return 'Withdrew on';
      default: return 'Date';
    }
  }

  function formatAmount(amount) {
    const num = parseFloat(amount);
    const formatted = Math.abs(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return num >= 0 ? `+${formatted}` : `-${formatted.replace('$', '')}`;
  }

  function getIcon(iconType) {
    const icons = {
      income: 'M12 4v16m8-8H4',
      shopping: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      food: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      transfer: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      subscription: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      utilities: 'M13 10V3L4 14h7v7l9-11h-7z',
      atm: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
      refund: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
    };
    return icons[iconType] || icons.shopping;
  }

  function getStatusVariant(status) {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'neutral';
    }
  }

  // Group transactions by date
  const groupedTransactions = $derived(() => {
    const groups = {};
    transactions.forEach(txn => {
      const dateKey = formatDate(txn.date);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(txn);
    });
    return Object.entries(groups);
  });
</script>

<div class="h-full bg-background flex flex-col overflow-hidden">
  {#if selectedTransaction}
    <!-- Detail View -->
    <div class="flex flex-col h-full">
      <AppHeader
        title="Transaction"
        showBack={true}
        backLabel=""
        onBack={closeDetail}
      >
        {#snippet actions()}
          <IconButton label="More options">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="5" r="1.5" fill="currentColor" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <circle cx="12" cy="19" r="1.5" fill="currentColor" />
            </svg>
          </IconButton>
        {/snippet}
      </AppHeader>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-4 py-6">
        <!-- Hero -->
        <div class="text-center mb-6">
          <div class="w-20 h-20 mx-auto mb-3 rounded-full {parseFloat(selectedTransaction.amount) >= 0 ? 'bg-success/15' : 'bg-muted'} flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 {parseFloat(selectedTransaction.amount) >= 0 ? 'text-success' : 'text-muted-foreground'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d={getIcon(selectedTransaction.icon)} />
            </svg>
          </div>
          <p class="text-2xl font-bold {parseFloat(selectedTransaction.amount) >= 0 ? 'text-success' : 'text-foreground'}">
            {formatAmount(selectedTransaction.amount)}
          </p>
          <p class="text-sm text-muted-foreground mt-1">{selectedTransaction.merchant}</p>
          {#if selectedTransaction.status !== 'completed'}
            <Badge variant={getStatusVariant(selectedTransaction.status)} class="mt-2">
              {selectedTransaction.status}
            </Badge>
          {/if}
        </div>

        <!-- Detail Fields -->
        <div class="space-y-3 mb-6">
          <div class="flex items-center gap-3.5 p-3.5 bg-muted/50 rounded-xl">
            <div class="w-5 h-5 text-primary shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-[11px] font-medium uppercase tracking-wide text-text-disabled">{getDateLabel(selectedTransaction.type)}</span>
              <span class="text-[15px] text-foreground">{formatFullDate(selectedTransaction.date)}</span>
            </div>
          </div>

          <div class="flex items-center gap-3.5 p-3.5 bg-muted/50 rounded-xl">
            <div class="w-5 h-5 text-primary shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-[11px] font-medium uppercase tracking-wide text-text-disabled">Category</span>
              <span class="text-[15px] text-foreground">{selectedTransaction.category}</span>
            </div>
          </div>

          <div class="flex items-center gap-3.5 p-3.5 bg-muted/50 rounded-xl">
            <div class="w-5 h-5 text-primary shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <span class="block text-[11px] font-medium uppercase tracking-wide text-text-disabled">Reference</span>
              <span class="text-[15px] text-foreground font-mono">{selectedTransaction.id}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <Button variant="primary" fullWidth>
            Share
          </Button>
          <Button variant="secondary" fullWidth>
            Report
          </Button>
        </div>
      </div>
    </div>
  {:else}
    <!-- Master List View -->
    <AppHeader title="Transactions">
      {#snippet actions()}
        <IconButton label="Refresh" onclick={loadData} disabled={loading}>
          {#if loading}
            <span class="loading loading-spinner loading-sm"></span>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          {/if}
        </IconButton>
      {/snippet}
    </AppHeader>

    <div class="flex-1 overflow-y-auto">
      {#if loading && transactions.length === 0}
        <!-- Loading Skeleton -->
        <div class="divide-y divide-border">
          {#each Array(6) as _}
            <div class="flex items-center gap-3 px-4 py-3">
              <Skeleton variant="circle" class="w-10 h-10" />
              <div class="flex-1 space-y-1.5">
                <Skeleton variant="text" class="w-28" />
                <Skeleton variant="text" class="w-20 h-3" />
              </div>
              <Skeleton variant="text" class="w-16" />
            </div>
          {/each}
        </div>
      {:else if error}
        <!-- Error State -->
        <div class="flex flex-col items-center justify-center py-12 text-center px-5">
          <div class="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-foreground mb-1">Failed to load</h3>
          <p class="text-sm text-muted-foreground mb-4">{error}</p>
          <Button variant="ghost" size="sm" onclick={loadData}>
            Try Again
          </Button>
        </div>
      {:else if transactions.length === 0}
        <!-- Empty State -->
        <div class="flex flex-col items-center justify-center py-12 text-center px-5">
          <div class="w-14 h-14 rounded-full bg-muted text-text-disabled flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-foreground mb-1">No transactions</h3>
          <p class="text-sm text-muted-foreground">Your transactions will appear here.</p>
        </div>
      {:else}
        <!-- Grouped Transaction List - Compact -->
        {#each groupedTransactions() as [dateLabel, txns]}
          <div class="px-4 py-1.5 bg-muted/50 sticky top-0 z-10">
            <span class="text-xs font-medium text-text-disabled uppercase tracking-wide">{dateLabel}</span>
          </div>
          <div class="divide-y divide-border">
            {#each txns as txn}
              <button
                class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 active:bg-muted transition-colors"
                onclick={() => openDetail(txn)}
              >
                <!-- Icon - Compact 40px -->
                <div class="w-10 h-10 rounded-full {parseFloat(txn.amount) >= 0 ? 'bg-success/15' : 'bg-muted'} flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 {parseFloat(txn.amount) >= 0 ? 'text-success' : 'text-muted-foreground'}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d={getIcon(txn.icon)} />
                  </svg>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-foreground text-[15px] truncate">{txn.merchant}</span>
                    {#if txn.status !== 'completed'}
                      <Badge variant={getStatusVariant(txn.status)} size="sm">
                        {txn.status}
                      </Badge>
                    {/if}
                  </div>
                  <p class="text-[13px] text-text-disabled truncate">{txn.category}</p>
                </div>

                <!-- Amount -->
                <span class="font-semibold text-[15px] {parseFloat(txn.amount) >= 0 ? 'text-success' : 'text-foreground'} shrink-0">
                  {formatAmount(txn.amount)}
                </span>

                <!-- Chevron -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-text-disabled shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            {/each}
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>
