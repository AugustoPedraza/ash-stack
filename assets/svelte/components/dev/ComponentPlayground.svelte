<!--
  Component Playground
  Interactive component browser with sidebar navigation
  Supports style presets: linear, clean, friendly
-->
<script>
  // Import all components
  import {
    Button, Input, Toggle, Badge, Avatar, Skeleton,
    Card, Modal, Sheet, Tabs, Dropdown,
    FormField, Select, Textarea, Checkbox,
    DataTable, Pagination, EmptyState,
    AnimatedList,
    SearchInput, DatePicker, FileUpload,
    CommandPalette, Breadcrumbs,
    ActivityFeed,
    StatCard, ProgressBar, MiniChart, Meter,
    AuthForm, OAuthButton,
    TypingIndicator,
    ConnectionStatus,
    // Conversation Components
    VoiceNote, ChatMessage, QuotedMessage, ChatInput,
    DecisionItem, TaskItem, ParticipantRow, ChannelPills, MessageThread
  } from '../ui';

  // Component categories
  const categories = {
    'Form': ['Button', 'Input', 'Toggle', 'Checkbox', 'Select', 'Textarea', 'FormField', 'SearchInput', 'DatePicker', 'FileUpload'],
    'Display': ['Badge', 'Avatar', 'Skeleton', 'StatCard', 'ProgressBar', 'MiniChart', 'Meter'],
    'Layout': ['Card', 'Page', 'PageHeader', 'Section', 'Tabs', 'Breadcrumbs', 'Sidebar'],
    'Overlay': ['Modal', 'Sheet', 'Dropdown', 'CommandPalette'],
    'Data': ['DataTable', 'Pagination', 'EmptyState', 'AnimatedList', 'InfiniteScroll', 'ActivityFeed'],
    'Feedback': ['NotificationCenter', 'ErrorBoundary', 'ConnectionStatus', 'TypingIndicator'],
    'Auth': ['AuthForm', 'OAuthButton'],
    'Realtime': ['RealtimeList'],
    'Conversation': ['ChatMessage', 'ChatInput', 'VoiceNote', 'QuotedMessage', 'MessageThread', 'DecisionItem', 'TaskItem', 'ParticipantRow', 'ChannelPills']
  };

  let activeCategory = 'Form';
  let activeComponent = 'Button';
  let sidebarOpen = false;

  // Preset controls
  let currentPreset = '';
  let currentTheme = 'light';
  let currentDensity = '';

  const presets = [
    { id: '', label: 'Default' },
    { id: 'linear', label: 'Linear' },
    { id: 'clean', label: 'Clean' },
    { id: 'friendly', label: 'Friendly' }
  ];

  function setPreset(preset) {
    currentPreset = preset;
    if (preset) {
      document.documentElement.setAttribute('data-preset', preset);
    } else {
      document.documentElement.removeAttribute('data-preset');
    }
  }

  function setTheme(theme) {
    currentTheme = theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function setDensity(density) {
    currentDensity = density;
    if (density) {
      document.documentElement.setAttribute('data-density', density);
    } else {
      document.documentElement.removeAttribute('data-density');
    }
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function closeSidebar() {
    sidebarOpen = false;
  }

  // Demo state
  let toggleChecked = false;
  let checkboxChecked = false;
  let inputValue = '';
  let selectValue = '';
  let textareaValue = '';
  let modalOpen = false;
  let sheetOpen = false;
  let dropdownOpen = false;
  let commandPaletteOpen = false;
  let dateValue = null;
  let tabValue = 'tab1';
  let progressValue = 65;

  const demoTabs = [
    { id: 'tab1', label: 'Overview' },
    { id: 'tab2', label: 'Details' },
    { id: 'tab3', label: 'Settings' }
  ];

  const demoColumns = [
    { key: 'id', label: 'ID', sortable: true, width: '80px' },
    { key: 'name', label: 'Name', sortable: true, primary: true },
    { key: 'status', label: 'Status' }
  ];

  const demoData = [
    { id: 1, name: 'Project Alpha', status: 'Active' },
    { id: 2, name: 'Project Beta', status: 'Pending' },
    { id: 3, name: 'Project Gamma', status: 'Complete' }
  ];

  const dropdownItems = [
    { id: 'edit', label: 'Edit', icon: '✏️' },
    { id: 'duplicate', label: 'Duplicate', icon: '📋' },
    { id: 'delete', label: 'Delete', danger: true, icon: '🗑️' }
  ];

  const breadcrumbItems = [
    { label: 'Home', href: '#' },
    { label: 'Projects', href: '#' },
    { label: 'Current' }
  ];

  const activityItems = [
    { id: 1, type: 'created', title: 'created a new project', timestamp: new Date(), user: { name: 'Alice' } },
    { id: 2, type: 'updated', title: 'updated settings', timestamp: new Date(Date.now() - 3600000), user: { name: 'Bob' } }
  ];

  const chartData = [10, 25, 15, 30, 20, 35, 25, 40, 30, 45];

  // Conversation demo data
  const demoSender = { id: '1', name: 'Alice Johnson', avatar: null, role: 'Designer' };
  const demoSender2 = { id: '2', name: 'Bob Smith', avatar: null };
  const demoParticipants = [
    { id: '1', name: 'Alice', status: 'online' },
    { id: '2', name: 'Bob', status: 'away' },
    { id: '3', name: 'Charlie', status: 'offline' },
    { id: '4', name: 'Diana', status: 'online' },
    { id: '5', name: 'Eve', status: 'busy' },
    { id: '6', name: 'Frank', status: 'online' }
  ];
  const demoChannels = [
    { id: 'general', label: 'General', icon: 'chat', count: 3 },
    { id: 'voice', label: 'Voice', icon: 'voice' },
    { id: 'files', label: 'Files', icon: 'file', count: 12 },
    { id: 'decisions', label: 'Decisions', icon: 'decision', count: 2 },
    { id: 'tasks', label: 'Tasks', icon: 'task', count: 5 }
  ];
  const demoVoters = [
    { id: '1', name: 'Alice', vote: 'approve' },
    { id: '2', name: 'Bob', vote: 'approve' },
    { id: '3', name: 'Charlie', vote: null },
    { id: '4', name: 'Diana', vote: 'reject' }
  ];
  let activeChannel = 'general';
  let chatInputValue = '';
  let voiceNoteState = 'idle';
  let replyTo = null;

  function selectComponent(category, component) {
    activeCategory = category;
    activeComponent = component;
    closeSidebar();
  }

  function handleCommandSelect(e) {
    console.log('Command selected:', e.detail);
    commandPaletteOpen = false;
  }
</script>

<div class="playground">
  <!-- Mobile Header -->
  <header class="mobile-header">
    <button class="menu-button" onclick={toggleSidebar} aria-label="Open menu">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
    <span class="mobile-title">{activeComponent}</span>
    <span class="mobile-badge">{activeCategory}</span>
  </header>

  <!-- Overlay -->
  {#if sidebarOpen}
    <button class="overlay" onclick={closeSidebar} aria-label="Close menu"></button>
  {/if}

  <!-- Sidebar -->
  <aside class="sidebar" class:open={sidebarOpen}>
    <div class="sidebar-header">
      <h1>Components</h1>
      <span class="component-count">{Object.values(categories).flat().length}</span>
    </div>

    <!-- Preset Controls -->
    <div class="preset-controls">
      <div class="control-group">
        <span class="control-label">Style</span>
        <div class="control-buttons">
          {#each presets as preset}
            <button
              class="preset-btn"
              class:active={currentPreset === preset.id}
              onclick={() => setPreset(preset.id)}
            >
              {preset.label}
            </button>
          {/each}
        </div>
      </div>

      <div class="control-row">
        <div class="control-group">
          <span class="control-label">Theme</span>
          <div class="control-buttons">
            <button
              class="preset-btn"
              class:active={currentTheme === 'light'}
              onclick={() => setTheme('light')}
              aria-label="Light theme"
            >☀️</button>
            <button
              class="preset-btn"
              class:active={currentTheme === 'dark'}
              onclick={() => setTheme('dark')}
              aria-label="Dark theme"
            >🌙</button>
          </div>
        </div>

        <div class="control-group">
          <span class="control-label">Density</span>
          <div class="control-buttons">
            <button
              class="preset-btn"
              class:active={currentDensity === 'compact'}
              onclick={() => setDensity('compact')}
              aria-label="Compact density"
            >−</button>
            <button
              class="preset-btn"
              class:active={currentDensity === ''}
              onclick={() => setDensity('')}
              aria-label="Default density"
            >○</button>
            <button
              class="preset-btn"
              class:active={currentDensity === 'comfortable'}
              onclick={() => setDensity('comfortable')}
              aria-label="Comfortable density"
            >+</button>
          </div>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      {#each Object.entries(categories) as [category, components]}
        <div class="nav-category">
          <button
            class="category-header"
            class:active={activeCategory === category}
            onclick={() => activeCategory = category}
          >
            {category}
            <span class="count">{components.length}</span>
          </button>

          {#if activeCategory === category}
            <ul class="component-list">
              {#each components as component}
                <li>
                  <button
                    class="component-link"
                    class:active={activeComponent === component}
                    onclick={() => selectComponent(category, component)}
                  >
                    {component}
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      {/each}
    </nav>
  </aside>

  <!-- Main content -->
  <main class="content">
    <header class="content-header">
      <h2>{activeComponent}</h2>
      <span class="category-badge">{activeCategory}</span>
    </header>

    <div class="preview-area">
      <!-- FORM COMPONENTS -->
      {#if activeComponent === 'Button'}
        <section class="demo-section">
          <h3>Variants</h3>
          <div class="demo-row">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </section>
        <section class="demo-section">
          <h3>Sizes</h3>
          <div class="demo-row align-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>
        <section class="demo-section">
          <h3>States</h3>
          <div class="demo-row">
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

      {:else if activeComponent === 'Input'}
        <section class="demo-section">
          <h3>Default</h3>
          <div class="demo-stack" style="max-width: 320px">
            <Input placeholder="Enter text..." bind:value={inputValue} />
            <Input size="sm" placeholder="Small input" />
            <Input size="lg" placeholder="Large input" />
          </div>
        </section>
        <section class="demo-section">
          <h3>States</h3>
          <div class="demo-stack" style="max-width: 320px">
            <Input invalid placeholder="Invalid input" />
            <Input disabled placeholder="Disabled input" />
          </div>
        </section>

      {:else if activeComponent === 'Toggle'}
        <section class="demo-section">
          <h3>Sizes</h3>
          <div class="demo-stack">
            <Toggle size="sm" label="Small toggle" />
            <Toggle bind:checked={toggleChecked} label="Medium toggle (default)" />
            <Toggle size="lg" label="Large toggle" />
          </div>
        </section>
        <section class="demo-section">
          <h3>With Description</h3>
          <Toggle label="Enable notifications" description="Receive email updates about your account" />
        </section>

      {:else if activeComponent === 'Checkbox'}
        <section class="demo-section">
          <h3>Basic</h3>
          <div class="demo-stack">
            <Checkbox bind:checked={checkboxChecked} label="Accept terms and conditions" />
            <Checkbox label="Subscribe to newsletter" description="Get weekly updates" />
            <Checkbox disabled label="Disabled checkbox" />
          </div>
        </section>

      {:else if activeComponent === 'Select'}
        <section class="demo-section">
          <h3>Basic</h3>
          <div style="max-width: 320px">
            <Select
              bind:value={selectValue}
              placeholder="Choose an option"
              options={[
                { value: 'opt1', label: 'Option 1' },
                { value: 'opt2', label: 'Option 2' },
                { value: 'opt3', label: 'Option 3' }
              ]}
            />
          </div>
        </section>

      {:else if activeComponent === 'Textarea'}
        <section class="demo-section">
          <h3>Basic</h3>
          <div style="max-width: 400px">
            <Textarea bind:value={textareaValue} placeholder="Enter your message..." rows={4} />
          </div>
        </section>

      {:else if activeComponent === 'FormField'}
        <section class="demo-section">
          <h3>With Label and Helper</h3>
          <div style="max-width: 320px">
            <FormField label="Email Address" helper="We'll never share your email" required>
              <Input type="email" placeholder="you@example.com" />
            </FormField>
          </div>
        </section>
        <section class="demo-section">
          <h3>With Error</h3>
          <div style="max-width: 320px">
            <FormField label="Password" error="Password must be at least 8 characters">
              <Input type="password" placeholder="Enter password" />
            </FormField>
          </div>
        </section>

      {:else if activeComponent === 'SearchInput'}
        <section class="demo-section">
          <h3>Basic</h3>
          <div style="max-width: 400px">
            <SearchInput placeholder="Search components..." />
          </div>
        </section>

      {:else if activeComponent === 'DatePicker'}
        <section class="demo-section">
          <h3>Basic</h3>
          <div style="max-width: 320px">
            <DatePicker bind:value={dateValue} />
          </div>
        </section>

      {:else if activeComponent === 'FileUpload'}
        <section class="demo-section">
          <h3>Default</h3>
          <div style="max-width: 400px">
            <FileUpload accept="image/*" />
          </div>
        </section>
        <section class="demo-section">
          <h3>Compact</h3>
          <div style="max-width: 400px">
            <FileUpload variant="compact" />
          </div>
        </section>

      <!-- DISPLAY COMPONENTS -->
      {:else if activeComponent === 'Badge'}
        <section class="demo-section">
          <h3>Variants</h3>
          <div class="demo-row">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </section>
        <section class="demo-section">
          <h3>Sizes</h3>
          <div class="demo-row align-center">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        </section>

      {:else if activeComponent === 'Avatar'}
        <section class="demo-section">
          <h3>Sizes</h3>
          <div class="demo-row align-center">
            <Avatar size="xs" alt="User" />
            <Avatar size="sm" alt="User" />
            <Avatar size="md" alt="User" />
            <Avatar size="lg" alt="User" />
            <Avatar size="xl" alt="User" />
          </div>
        </section>
        <section class="demo-section">
          <h3>With Status</h3>
          <div class="demo-row">
            <Avatar status="online" alt="Online" />
            <Avatar status="offline" alt="Offline" />
            <Avatar status="busy" alt="Busy" />
          </div>
        </section>

      {:else if activeComponent === 'Skeleton'}
        <section class="demo-section">
          <h3>Variants</h3>
          <div class="demo-stack" style="max-width: 300px">
            <Skeleton variant="text" />
            <Skeleton variant="text" lines={3} />
            <div class="demo-row">
              <Skeleton variant="avatar" />
              <Skeleton variant="button" />
            </div>
            <Skeleton variant="card" height="100px" />
          </div>
        </section>

      {:else if activeComponent === 'StatCard'}
        <section class="demo-section">
          <h3>Basic</h3>
          <div class="demo-row">
            <StatCard label="Total Users" value={1234} previousValue={1100} />
            <StatCard label="Revenue" value={45600} format="currency" previousValue={42000} />
            <StatCard label="Conversion" value={3.2} format="percent" />
          </div>
        </section>

      {:else if activeComponent === 'ProgressBar'}
        <section class="demo-section">
          <h3>Variants</h3>
          <div class="demo-stack" style="max-width: 400px">
            <ProgressBar value={progressValue} showLabel />
            <ProgressBar value={80} variant="success" showLabel />
            <ProgressBar value={30} variant="warning" showLabel />
            <ProgressBar value={15} variant="error" showLabel />
          </div>
        </section>
        <section class="demo-section">
          <h3>Indeterminate</h3>
          <div style="max-width: 400px">
            <ProgressBar indeterminate />
          </div>
        </section>

      {:else if activeComponent === 'MiniChart'}
        <section class="demo-section">
          <h3>Types</h3>
          <div class="demo-row">
            <div>
              <p class="demo-label">Line</p>
              <MiniChart data={chartData} type="line" />
            </div>
            <div>
              <p class="demo-label">Bar</p>
              <MiniChart data={chartData} type="bar" />
            </div>
            <div>
              <p class="demo-label">Area</p>
              <MiniChart data={chartData} type="area" />
            </div>
          </div>
        </section>

      {:else if activeComponent === 'Meter'}
        <section class="demo-section">
          <h3>Types</h3>
          <div class="demo-row">
            <Meter value={65} type="circle" />
            <Meter value={65} type="semicircle" />
          </div>
          <div style="max-width: 300px; margin-top: 1rem;">
            <Meter value={65} type="linear" />
          </div>
        </section>

      <!-- LAYOUT COMPONENTS -->
      {:else if activeComponent === 'Card'}
        <section class="demo-section">
          <h3>Basic</h3>
          <div style="max-width: 400px">
            <Card title="Card Title" description="This is a card description">
              <p>Card content goes here. You can put any content inside.</p>
            </Card>
          </div>
        </section>

      {:else if activeComponent === 'Tabs'}
        <section class="demo-section">
          <h3>Variants</h3>
          <div style="max-width: 400px">
            <Tabs tabs={demoTabs} bind:value={tabValue} />
          </div>
        </section>

      {:else if activeComponent === 'Breadcrumbs'}
        <section class="demo-section">
          <h3>Basic</h3>
          <Breadcrumbs items={breadcrumbItems} />
        </section>
        <section class="demo-section">
          <h3>Separators</h3>
          <div class="demo-stack">
            <Breadcrumbs items={breadcrumbItems} separator="chevron" />
            <Breadcrumbs items={breadcrumbItems} separator="arrow" />
            <Breadcrumbs items={breadcrumbItems} separator="dot" />
          </div>
        </section>

      {:else if activeComponent === 'Page' || activeComponent === 'PageHeader' || activeComponent === 'Section' || activeComponent === 'Sidebar'}
        <section class="demo-section">
          <h3>Layout Component</h3>
          <p class="demo-note">This component is meant to be used as a page wrapper. See the Page layout documentation for usage examples.</p>
        </section>

      <!-- OVERLAY COMPONENTS -->
      {:else if activeComponent === 'Modal'}
        <section class="demo-section">
          <h3>Interactive Demo</h3>
          <Button on:click={() => modalOpen = true}>Open Modal</Button>
          {#if modalOpen}
            <Modal bind:open={modalOpen} title="Modal Title">
              <p>This is the modal content. You can put any content here.</p>
              <svelte:fragment slot="footer">
                <Button variant="secondary" on:click={() => modalOpen = false}>Cancel</Button>
                <Button variant="primary" on:click={() => modalOpen = false}>Confirm</Button>
              </svelte:fragment>
            </Modal>
          {/if}
        </section>

      {:else if activeComponent === 'Sheet'}
        <section class="demo-section">
          <h3>Interactive Demo</h3>
          <Button on:click={() => sheetOpen = true}>Open Sheet</Button>
          {#if sheetOpen}
            <Sheet bind:open={sheetOpen} title="Sheet Title">
              <p>Sheet content with gesture-based dismiss. Swipe down to close on mobile.</p>
              <svelte:fragment slot="footer">
                <Button variant="secondary" on:click={() => sheetOpen = false}>Cancel</Button>
                <Button variant="primary" on:click={() => sheetOpen = false}>Confirm</Button>
              </svelte:fragment>
            </Sheet>
          {/if}
        </section>

      {:else if activeComponent === 'Dropdown'}
        <section class="demo-section">
          <h3>Interactive Demo</h3>
          <Dropdown items={dropdownItems} bind:open={dropdownOpen} mobileSheet={false}>
            <svelte:fragment slot="trigger">
              <Button variant="secondary">Open Menu</Button>
            </svelte:fragment>
          </Dropdown>
        </section>

      {:else if activeComponent === 'CommandPalette'}
        <section class="demo-section">
          <h3>Interactive Demo</h3>
          <Button on:click={() => commandPaletteOpen = true}>Open Command Palette (⌘K)</Button>
          <CommandPalette
            bind:open={commandPaletteOpen}
            on:select={handleCommandSelect}
            commands={[
              { id: 'new', label: 'New File', shortcut: '⌘N', group: 'File' },
              { id: 'open', label: 'Open File', shortcut: '⌘O', group: 'File' },
              { id: 'save', label: 'Save', shortcut: '⌘S', group: 'File' }
            ]}
          />
        </section>

      <!-- DATA COMPONENTS -->
      {:else if activeComponent === 'DataTable'}
        <section class="demo-section">
          <h3>Basic Table</h3>
          <DataTable columns={demoColumns} data={demoData} />
        </section>

      {:else if activeComponent === 'Pagination'}
        <section class="demo-section">
          <h3>Modes</h3>
          <div class="demo-stack">
            <Pagination page={1} totalPages={10} totalItems={100} mode="full" />
            <Pagination page={1} totalPages={10} mode="simple" />
            <Pagination page={1} totalPages={10} mode="minimal" />
          </div>
        </section>

      {:else if activeComponent === 'EmptyState'}
        <section class="demo-section">
          <h3>Presets</h3>
          <div class="demo-row" style="gap: 2rem">
            <EmptyState preset="default" title="No items" size="sm" />
            <EmptyState preset="search" title="No results" size="sm" />
            <EmptyState preset="error" title="Something went wrong" size="sm" />
          </div>
        </section>

      {:else if activeComponent === 'AnimatedList'}
        <section class="demo-section">
          <h3>Demo</h3>
          <AnimatedList items={demoData} animation="slide" let:item>
            <div class="demo-list-item">{item.name}</div>
          </AnimatedList>
        </section>

      {:else if activeComponent === 'InfiniteScroll'}
        <section class="demo-section">
          <h3>Usage</h3>
          <p class="demo-note">Wrap scrollable content to enable infinite loading. Dispatches 'loadMore' event when scrolled near bottom.</p>
        </section>

      {:else if activeComponent === 'ActivityFeed'}
        <section class="demo-section">
          <h3>Basic</h3>
          <ActivityFeed items={activityItems} />
        </section>

      <!-- FEEDBACK COMPONENTS -->
      {:else if activeComponent === 'NotificationCenter'}
        <section class="demo-section">
          <h3>Usage</h3>
          <p class="demo-note">Displays a notification bell with dropdown. Pass notifications array with unread count.</p>
        </section>

      {:else if activeComponent === 'ErrorBoundary'}
        <section class="demo-section">
          <h3>Usage</h3>
          <p class="demo-note">Wrap components to catch errors gracefully. Displays fallback UI on error.</p>
        </section>

      {:else if activeComponent === 'ConnectionStatus'}
        <section class="demo-section">
          <h3>Demo</h3>
          <ConnectionStatus showOnlyWhenDisconnected={false} />
        </section>

      {:else if activeComponent === 'TypingIndicator'}
        <section class="demo-section">
          <h3>Demo</h3>
          <TypingIndicator users={[{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]} />
        </section>

      <!-- AUTH COMPONENTS -->
      {:else if activeComponent === 'AuthForm'}
        <section class="demo-section">
          <h3>Login</h3>
          <div style="max-width: 400px">
            <AuthForm mode="login" />
          </div>
        </section>

      {:else if activeComponent === 'OAuthButton'}
        <section class="demo-section">
          <h3>Providers</h3>
          <div class="demo-stack" style="max-width: 300px">
            <OAuthButton provider="google" />
            <OAuthButton provider="github" />
            <OAuthButton provider="apple" />
          </div>
        </section>

      <!-- REALTIME COMPONENTS -->
      {:else if activeComponent === 'RealtimeList'}
        <section class="demo-section">
          <h3>Usage</h3>
          <p class="demo-note">Connects to a realtime store for live updates. Use with createRealtimeStore().</p>
        </section>

      <!-- CONVERSATION COMPONENTS -->
      {:else if activeComponent === 'ChatMessage'}
        <section class="demo-section">
          <h3>Basic Message</h3>
          <div style="max-width: 500px">
            <ChatMessage
              sender={demoSender}
              content="Hey everyone! Check out this new design I've been working on. Let me know what you think @Bob"
              timestamp={new Date()}
              mentions={[{ id: '2', name: 'Bob' }]}
            />
          </div>
        </section>
        <section class="demo-section">
          <h3>Own Message</h3>
          <div style="max-width: 500px">
            <ChatMessage
              sender={demoSender2}
              content="Looks great! I'll review it this afternoon."
              timestamp={new Date()}
              isOwn={true}
            />
          </div>
        </section>
        <section class="demo-section">
          <h3>With Link</h3>
          <div style="max-width: 500px">
            <ChatMessage
              sender={demoSender}
              content="Here's the documentation: https://example.com/docs"
              timestamp={new Date()}
            />
          </div>
        </section>

      {:else if activeComponent === 'ChatInput'}
        <section class="demo-section">
          <h3>Default</h3>
          <div style="max-width: 500px">
            <ChatInput
              bind:value={chatInputValue}
              placeholder="Type a message..."
              enableVoice
              enableAttachments
            />
          </div>
        </section>
        <section class="demo-section">
          <h3>With Reply</h3>
          <div style="max-width: 500px">
            <ChatInput
              placeholder="Type a message..."
              replyTo={demoSender}
              on:cancelreply={() => {}}
            />
          </div>
        </section>

      {:else if activeComponent === 'VoiceNote'}
        <section class="demo-section">
          <h3>Recording Mode</h3>
          <div style="max-width: 400px">
            <VoiceNote allowRecording />
          </div>
        </section>
        <section class="demo-section">
          <h3>Playback Mode</h3>
          <p class="demo-note">Record a voice note above to see playback mode, or provide an audio src.</p>
        </section>

      {:else if activeComponent === 'QuotedMessage'}
        <section class="demo-section">
          <h3>Text Quote</h3>
          <div style="max-width: 400px">
            <QuotedMessage
              sender={demoSender}
              content="This is the original message that was quoted. It can be quite long and will be truncated automatically."
              type="text"
            />
          </div>
        </section>
        <section class="demo-section">
          <h3>Voice Quote</h3>
          <div style="max-width: 400px">
            <QuotedMessage
              sender={demoSender2}
              type="voice"
              duration={45}
            />
          </div>
        </section>
        <section class="demo-section">
          <h3>File Quote</h3>
          <div style="max-width: 400px">
            <QuotedMessage
              sender={demoSender}
              type="file"
              fileName="design-specs.pdf"
            />
          </div>
        </section>

      {:else if activeComponent === 'MessageThread'}
        <section class="demo-section">
          <h3>With Date Separator</h3>
          <div style="max-width: 500px">
            <MessageThread date={new Date()} showDate>
              <ChatMessage
                sender={demoSender}
                content="Starting the discussion about the new feature."
                timestamp={new Date()}
              />
              <ChatMessage
                sender={demoSender2}
                content="I have some ideas to share!"
                timestamp={new Date()}
                showAvatar={false}
                showName={false}
              />
            </MessageThread>
          </div>
        </section>
        <section class="demo-section">
          <h3>Topic Thread</h3>
          <div style="max-width: 500px">
            <MessageThread
              title="Q3 Planning Discussion"
              replyCount={12}
              unreadCount={3}
              collapsible
            >
              <ChatMessage
                sender={demoSender}
                content="Let's discuss the Q3 roadmap priorities."
                timestamp={new Date()}
              />
            </MessageThread>
          </div>
        </section>

      {:else if activeComponent === 'DecisionItem'}
        <section class="demo-section">
          <h3>Pending Decision</h3>
          <div style="max-width: 500px">
            <DecisionItem
              title="Should we proceed with the new design system?"
              description="This will affect all our products and require significant resources."
              status="pending"
              voters={demoVoters}
              deadline={new Date(Date.now() + 86400000 * 2)}
              canVote
            />
          </div>
        </section>
        <section class="demo-section">
          <h3>Approved Decision</h3>
          <div style="max-width: 500px">
            <DecisionItem
              title="Use Svelte for the frontend"
              status="approved"
              voters={demoVoters}
              compact
            />
          </div>
        </section>

      {:else if activeComponent === 'TaskItem'}
        <section class="demo-section">
          <h3>Pending Task</h3>
          <div style="max-width: 500px">
            <TaskItem
              title="Review the new component designs"
              assignee={demoSender}
              dueDate={new Date(Date.now() + 86400000)}
              priority="high"
              tags={['design', 'urgent']}
            />
          </div>
        </section>
        <section class="demo-section">
          <h3>Completed Task</h3>
          <div style="max-width: 500px">
            <TaskItem
              title="Set up the development environment"
              completed
              assignee={demoSender2}
            />
          </div>
        </section>
        <section class="demo-section">
          <h3>Overdue Task</h3>
          <div style="max-width: 500px">
            <TaskItem
              title="Submit quarterly report"
              dueDate={new Date(Date.now() - 86400000)}
              priority="urgent"
            />
          </div>
        </section>

      {:else if activeComponent === 'ParticipantRow'}
        <section class="demo-section">
          <h3>Stacked Avatars</h3>
          <ParticipantRow
            participants={demoParticipants}
            maxVisible={4}
            showStatus
          />
        </section>
        <section class="demo-section">
          <h3>With Label</h3>
          <ParticipantRow
            participants={demoParticipants}
            maxVisible={3}
            label="6 participants"
          />
        </section>
        <section class="demo-section">
          <h3>Different Sizes</h3>
          <div class="demo-stack">
            <ParticipantRow participants={demoParticipants.slice(0, 3)} size="xs" />
            <ParticipantRow participants={demoParticipants.slice(0, 3)} size="sm" />
            <ParticipantRow participants={demoParticipants.slice(0, 3)} size="md" />
          </div>
        </section>

      {:else if activeComponent === 'ChannelPills'}
        <section class="demo-section">
          <h3>Default</h3>
          <ChannelPills
            channels={demoChannels}
            bind:active={activeChannel}
          />
        </section>
        <section class="demo-section">
          <h3>Compact</h3>
          <ChannelPills
            channels={demoChannels}
            variant="compact"
            bind:active={activeChannel}
          />
        </section>

      {:else}
        <section class="demo-section">
          <p class="demo-note">Select a component from the sidebar to view its demo.</p>
        </section>
      {/if}
    </div>
  </main>
</div>

<style>
  .playground {
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: 100vh;
    background-color: var(--color-background);
    color: var(--color-text);
  }

  /* Sidebar */
  .sidebar {
    background-color: var(--color-surface);
    border-right: 1px solid var(--color-border);
    overflow-y: auto;
    position: sticky;
    top: 0;
    height: 100vh;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  .sidebar-header h1 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .component-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    border-radius: 9999px;
  }

  /* Preset Controls */
  .preset-controls {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .control-row {
    display: flex;
    gap: 1rem;
  }

  .control-row .control-group {
    flex: 1;
  }

  .control-label {
    font-size: 0.6875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
  }

  .control-buttons {
    display: flex;
    gap: 0.25rem;
  }

  .preset-btn {
    flex: 1;
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    background-color: var(--color-surface-sunken);
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .preset-btn:hover {
    background-color: var(--color-surface-raised);
    color: var(--color-text);
  }

  .preset-btn.active {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    border-color: var(--color-primary);
  }

  .sidebar-nav {
    padding: 0.5rem;
  }

  .nav-category {
    margin-bottom: 0.25rem;
  }

  .category-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: left;
    background: none;
    border: none;
    border-radius: 0.375rem;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .category-header:hover {
    background-color: var(--color-surface-raised);
    color: var(--color-text);
  }

  .category-header.active {
    background-color: var(--color-surface-raised);
    color: var(--color-text);
    font-weight: 600;
  }

  .category-header .count {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .component-list {
    margin: 0;
    padding: 0.25rem 0 0.5rem 0;
    list-style: none;
  }

  .component-link {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 1.5rem;
    font-size: 0.8125rem;
    text-align: left;
    background: none;
    border: none;
    border-radius: 0.375rem;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .component-link:hover {
    background-color: var(--color-surface-sunken);
    color: var(--color-text);
  }

  .component-link.active {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }

  /* Content */
  .content {
    padding: 2rem;
    overflow-y: auto;
  }

  .content-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  .content-header h2 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 600;
  }

  .category-badge {
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    background-color: var(--color-surface-raised);
    color: var(--color-text-muted);
    border-radius: 9999px;
  }

  .preview-area {
    max-width: 800px;
  }

  .demo-section {
    margin-bottom: 2.5rem;
  }

  .demo-section h3 {
    margin: 0 0 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .demo-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .demo-row.align-center {
    align-items: center;
  }

  .demo-stack {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .demo-label {
    margin: 0 0 0.5rem;
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }

  .demo-note {
    padding: 1rem;
    font-size: 0.875rem;
    color: var(--color-text-muted);
    background-color: var(--color-surface-sunken);
    border-radius: 0.5rem;
  }

  .demo-list-item {
    padding: 0.75rem 1rem;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
  }

  /* Mobile Header */
  .mobile-header {
    display: none;
  }

  .overlay {
    display: none;
  }

  /* Mobile */
  @media (max-width: 768px) {
    .playground {
      grid-template-columns: 1fr;
    }

    .mobile-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 1rem;
      background-color: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
    }

    .menu-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;
      background: none;
      border: 1px solid var(--color-border);
      border-radius: 0.5rem;
      color: var(--color-text);
      cursor: pointer;
    }

    .menu-button svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .mobile-title {
      flex: 1;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .mobile-badge {
      padding: 0.25rem 0.5rem;
      font-size: 0.6875rem;
      font-weight: 500;
      background-color: var(--color-surface-raised);
      color: var(--color-text-muted);
      border-radius: 9999px;
    }

    .overlay {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 90;
      background-color: rgba(0, 0, 0, 0.5);
      border: none;
      cursor: pointer;
    }

    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
      width: 280px;
      transform: translateX(-100%);
      transition: transform 0.25s ease;
    }

    .sidebar.open {
      transform: translateX(0);
    }

    .content {
      padding: 1rem;
    }

    .content-header {
      display: none;
    }

    .demo-row {
      gap: 0.5rem;
    }

    .preview-area {
      max-width: 100%;
    }
  }
</style>
