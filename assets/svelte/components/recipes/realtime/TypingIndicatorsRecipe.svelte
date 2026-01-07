<script>
  /**
   * Typing Indicators Recipe
   * Multiple user typing display with various styles and debouncing.
   *
   * Uses: Button
   */
  import { Button } from '../../ui';

  // Mock typing users
  let typingUsers = $state([]);

  const allUsers = [
    { id: 1, name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/40?img=1' },
    { id: 2, name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/40?img=2' },
    { id: 3, name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/40?img=3' },
    { id: 4, name: 'Alex Kim', avatar: 'https://i.pravatar.cc/40?img=4' },
  ];

  // Demo controls
  let selectedUsers = $state([]);

  function toggleUserTyping(user) {
    if (selectedUsers.find(u => u.id === user.id)) {
      selectedUsers = selectedUsers.filter(u => u.id !== user.id);
    } else {
      selectedUsers = [...selectedUsers, user];
    }
    typingUsers = [...selectedUsers];
  }

  // Format typing text
  const typingText = $derived.by(() => {
    if (typingUsers.length === 0) return '';
    if (typingUsers.length === 1) return `${typingUsers[0].name} is typing`;
    if (typingUsers.length === 2) return `${typingUsers[0].name} and ${typingUsers[1].name} are typing`;
    if (typingUsers.length === 3) return `${typingUsers[0].name}, ${typingUsers[1].name}, and ${typingUsers[2].name} are typing`;
    return `${typingUsers[0].name}, ${typingUsers[1].name}, and ${typingUsers.length - 2} others are typing`;
  });

  // Simulate random typing
  let autoSimulate = $state(false);
  let simulateInterval = null;

  function toggleAutoSimulate() {
    autoSimulate = !autoSimulate;
    if (autoSimulate) {
      simulateInterval = setInterval(() => {
        // Randomly add or remove a typing user
        if (Math.random() > 0.5 && typingUsers.length < 3) {
          const notTyping = allUsers.filter(u => !typingUsers.find(t => t.id === u.id));
          if (notTyping.length > 0) {
            const user = notTyping[Math.floor(Math.random() * notTyping.length)];
            typingUsers = [...typingUsers, user];
            selectedUsers = [...typingUsers];
          }
        } else if (typingUsers.length > 0) {
          typingUsers = typingUsers.slice(0, -1);
          selectedUsers = [...typingUsers];
        }
      }, 1500);
    } else {
      clearInterval(simulateInterval);
    }
  }

  $effect(() => {
    return () => {
      if (simulateInterval) clearInterval(simulateInterval);
    };
  });
</script>

<div class="h-full bg-surface overflow-y-auto px-5 py-6">
  <div class="max-w-md mx-auto">
    <div class="mb-8">
      <h1 class="text-xl font-semibold text-text mb-2">Typing Indicators</h1>
      <p class="text-text-muted text-sm">Various styles for showing who is typing.</p>
    </div>

    <!-- Demo Controls -->
    <div class="mb-8 p-4 bg-surface-sunken rounded-xl">
      <p class="text-sm font-medium text-text mb-3">Toggle users typing:</p>
      <div class="flex flex-wrap gap-2 mb-4">
        {#each allUsers as user}
          <button
            type="button"
            class="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors
              {selectedUsers.find(u => u.id === user.id)
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border-strong hover:bg-border'}"
            onclick={() => toggleUserTyping(user)}
          >
            <img src={user.avatar} alt={user.name} class="w-6 h-6 rounded-full" />
            <span class="text-sm">{user.name.split(' ')[0]}</span>
          </button>
        {/each}
      </div>
      <button
        type="button"
        class="text-sm font-medium transition-colors {autoSimulate ? 'text-primary' : 'text-text-muted hover:text-text'}"
        onclick={toggleAutoSimulate}
      >
        {autoSimulate ? 'Stop auto-simulate' : 'Auto-simulate typing'}
      </button>
    </div>

    <!-- Style 1: Simple Text -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-text mb-3">Simple Text</h2>
      <div class="p-4 bg-surface-sunken/50 rounded-xl min-h-[60px] flex items-center">
        {#if typingUsers.length > 0}
          <p class="text-sm text-text-muted italic">
            {typingText}...
          </p>
        {:else}
          <p class="text-sm text-text-disabled">No one is typing</p>
        {/if}
      </div>
    </div>

    <!-- Style 2: With Dots Animation -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-text mb-3">With Animated Dots</h2>
      <div class="p-4 bg-surface-sunken/50 rounded-xl min-h-[60px] flex items-center">
        {#if typingUsers.length > 0}
          <div class="flex items-center gap-2">
            <span class="text-sm text-text-muted">{typingText}</span>
            <span class="flex gap-1">
              <span class="w-1.5 h-1.5 bg-text-disabled rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-1.5 h-1.5 bg-text-disabled rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-1.5 h-1.5 bg-text-disabled rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </span>
          </div>
        {:else}
          <p class="text-sm text-text-disabled">No one is typing</p>
        {/if}
      </div>
    </div>

    <!-- Style 3: With Avatars -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-text mb-3">With Avatars</h2>
      <div class="p-4 bg-surface-sunken/50 rounded-xl min-h-[60px] flex items-center">
        {#if typingUsers.length > 0}
          <div class="flex items-center gap-2">
            <div class="flex -space-x-2">
              {#each typingUsers.slice(0, 3) as user}
                <img
                  src={user.avatar}
                  alt={user.name}
                  class="w-7 h-7 rounded-full ring-2 ring-surface"
                />
              {/each}
              {#if typingUsers.length > 3}
                <div class="w-7 h-7 rounded-full bg-border-strong ring-2 ring-surface flex items-center justify-center">
                  <span class="text-xs text-text-muted">+{typingUsers.length - 3}</span>
                </div>
              {/if}
            </div>
            <span class="text-sm text-text-muted">typing</span>
            <span class="flex gap-1">
              <span class="w-1.5 h-1.5 bg-text-disabled rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-1.5 h-1.5 bg-text-disabled rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-1.5 h-1.5 bg-text-disabled rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </span>
          </div>
        {:else}
          <p class="text-sm text-text-disabled">No one is typing</p>
        {/if}
      </div>
    </div>

    <!-- Style 4: Bubble Style (Chat-like) -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-text mb-3">Bubble Style (Chat)</h2>
      <div class="p-4 bg-surface-sunken/50 rounded-xl min-h-[80px]">
        {#if typingUsers.length > 0}
          <div class="flex items-start gap-2">
            <img
              src={typingUsers[0].avatar}
              alt={typingUsers[0].name}
              class="w-8 h-8 rounded-full"
            />
            <div>
              <p class="text-xs text-text-muted mb-1">
                {typingUsers.length === 1 ? typingUsers[0].name : `${typingUsers[0].name} and others`}
              </p>
              <div class="bg-surface-sunken px-4 py-3 rounded-t-2xl rounded-br-2xl rounded-bl-sm inline-flex gap-1.5">
                <span class="w-2 h-2 bg-text-disabled rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-2 h-2 bg-text-disabled rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-2 h-2 bg-text-disabled rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </div>
            </div>
          </div>
        {:else}
          <p class="text-sm text-text-disabled text-center py-4">No one is typing</p>
        {/if}
      </div>
    </div>

    <!-- Style 5: Inline Badge -->
    <div class="mb-8">
      <h2 class="text-sm font-medium text-text mb-3">Inline Badge</h2>
      <div class="p-4 bg-surface-sunken/50 rounded-xl min-h-[60px] flex items-center">
        {#if typingUsers.length > 0}
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full">
            <span class="flex gap-1">
              <span class="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </span>
            <span class="text-xs font-medium">
              {typingUsers.length === 1 ? typingUsers[0].name.split(' ')[0] : `${typingUsers.length} people`} typing
            </span>
          </div>
        {:else}
          <p class="text-sm text-text-disabled">No one is typing</p>
        {/if}
      </div>
    </div>

    <!-- Mobile UX Note -->
    <div class="p-4 bg-primary/5 border border-primary/20 rounded-lg">
      <h3 class="text-sm font-medium text-primary mb-2">Mobile UX Patterns</h3>
      <ul class="text-xs text-text-secondary space-y-1">
        <li>• Debounce typing events (300-500ms)</li>
        <li>• Show max 3 avatars, then "+N"</li>
        <li>• Auto-hide after 3-5s of no input</li>
        <li>• Keep indicator near message input</li>
      </ul>
    </div>
  </div>
</div>
