<!--
  Component Playground
  Auto-generated - DO NOT EDIT MANUALLY
  Run: npm run gen:playground
-->
<script>
  import {
  ActivityFeed,
  AnimatedList,
  AuthForm,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  CommandPalette,
  ConnectionStatus,
  DataTable,
  DatePicker,
  Dropdown,
  EmptyState,
  ErrorBoundary,
  FileUpload,
  Form,
  FormField,
  InfiniteScroll,
  Input,
  Meter,
  MiniChart,
  Modal,
  NotificationCenter,
  OAuthButton,
  Page,
  PageHeader,
  Pagination,
  ProgressBar,
  RealtimeList,
  SearchInput,
  Section,
  Select,
  Sheet,
  Sidebar,
  Skeleton,
  StatCard,
  SubmitButton,
  Tabs,
  Textarea,
  Toast,
  ToastContainer,
  Toggle,
  TypingIndicator
  } from '../ui';

  // Demo state
  let toggleChecked = false;
  let inputValue = '';
  let selectValue = '';
  let modalOpen = false;
  let sheetOpen = false;
  let dropdownOpen = false;

  const demoItems = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];

  const demoTabs = [
    { id: 'tab1', label: 'First' },
    { id: 'tab2', label: 'Second' },
    { id: 'tab3', label: 'Third' }
  ];

  const demoColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true, primary: true }
  ];

  const dropdownItems = [
    { id: 'edit', label: 'Edit' },
    { id: 'delete', label: 'Delete', danger: true }
  ];
</script>

<div class="playground">
  <header class="playground-header">
    <h1>Component Playground</h1>
    <p>Auto-generated from component JSDoc. Last updated: 12/31/2025</p>
  </header>

  <nav class="playground-nav">
    <a href="#other">other</a>
    <a href="#animation">animation</a>
    <a href="#form">form</a>
    <a href="#display">display</a>
    <a href="#layout">layout</a>
    <a href="#data">data</a>
    <a href="#interactive">interactive</a>
    <a href="#feedback">feedback</a>
  </nav>

  <main class="playground-content">

  <!-- OTHER -->
  <section class="category-section">
    <h2>Other Components</h2>
    
    <!-- ActivityFeed -->
    <div class="component-block">
      <div class="component-header">
        <h3>ActivityFeed</h3>
        <p class="component-desc">ActivityFeed Component Timeline-style activity/event feed with grouping and real-time support.</p>
      </div>
      <div class="component-preview">
        <ActivityFeed />
      </div>
      <details class="component-props">
        <summary>Props (8)</summary>
        <ul>
          <li><code>items</code>: Array&lt;&#123; id: string | number, type: string, title: string, description?: string, timestamp: Date | string, user?: &#123; name: string, avatar?: string = []</li>
          <li><code>groupByDate</code>: boolean = true</li>
          <li><code>showAvatars</code>: boolean = true</li>
          <li><code>showTimeline</code>: boolean = true</li>
          <li><code>loading</code>: boolean = false</li>
          <li><code>emptyMessage</code>: string = 'No activity yet'</li>
          <li><code>compact</code>: boolean = false</li>
          <li><code>typeConfig</code>: Record&lt;string, &#123; icon?: string, color?: string = &#123;&#125;</li>
        </ul>
      </details>
    </div>

    <!-- Breadcrumbs -->
    <div class="component-block">
      <div class="component-header">
        <h3>Breadcrumbs</h3>
        <p class="component-desc">Breadcrumbs Component Navigation breadcrumb trail with responsive collapse.</p>
      </div>
      <div class="component-preview">
        <Breadcrumbs />
      </div>
      <details class="component-props">
        <summary>Props (5)</summary>
        <ul>
          <li><code>items</code>: Array&lt;&#123; label: string, href?: string, icon?: string = []</li>
          <li><code>separator</code>: 'slash' | 'chevron' | 'arrow' | 'dot' = 'chevron'</li>
          <li><code>maxItems</code>: number = 0</li>
          <li><code>home</code>: &#123; href?: string, icon?: string, label?: string = null</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
        </ul>
      </details>
    </div>

    <!-- CommandPalette -->
    <div class="component-block">
      <div class="component-header">
        <h3>CommandPalette</h3>
        <p class="component-desc">CommandPalette Component Keyboard-driven command palette (⌘K / Ctrl+K). Supports search, keyboard na...</p>
      </div>
      <div class="component-preview">
        <CommandPalette />
      </div>
      <details class="component-props">
        <summary>Props (8)</summary>
        <ul>
          <li><code>open</code>: boolean = false</li>
          <li><code>commands</code>: Array&lt;&#123; id: string, label: string, description?: string, icon?: string, shortcut?: string, group?: string, action?: () =&gt; void, href?: string = []</li>
          <li><code>placeholder</code>: string = 'Search commands...'</li>
          <li><code>showRecent</code>: boolean = true</li>
          <li><code>maxRecent</code>: number = 5</li>
          <li><code>storageKey</code>: string = 'command-palette-recent'</li>
          <li><code>filter</code>: ((command: object, query: string) =&gt; boolean) | null = null</li>
          <li><code>closeOnSelect</code>: boolean = true</li>
        </ul>
      </details>
    </div>

    <!-- ConnectionStatus -->
    <div class="component-block">
      <div class="component-header">
        <h3>ConnectionStatus</h3>
        <p class="component-desc">ConnectionStatus Component Shows LiveView connection state with reconnection UI. Useful for real-tim...</p>
      </div>
      <div class="component-preview">
        <ConnectionStatus />
      </div>
      <details class="component-props">
        <summary>Props (5)</summary>
        <ul>
          <li><code>position</code>: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline' = 'bottom-right'</li>
          <li><code>showOnlyWhenDisconnected</code>: boolean = true</li>
          <li><code>autoHideDelay</code>: number = 3000</li>
          <li><code>showReconnectButton</code>: boolean = true</li>
          <li><code>messages</code>: &#123; connecting?: string, connected?: string, disconnected?: string, error?: string = &#123;&#125;</li>
        </ul>
      </details>
    </div>

    <!-- DatePicker -->
    <div class="component-block">
      <div class="component-header">
        <h3>DatePicker</h3>
        <p class="component-desc">DatePicker Component Calendar-based date picker with range selection support.</p>
      </div>
      <div class="component-preview">
        <DatePicker />
      </div>
      <details class="component-props">
        <summary>Props (12)</summary>
        <ul>
          <li><code>value</code>: Date | null = null</li>
          <li><code>endValue</code>: Date | null = null</li>
          <li><code>range</code>: boolean = false</li>
          <li><code>placeholder</code>: string = 'Select date'</li>
          <li><code>format</code>: string = 'MMM d, yyyy'</li>
          <li><code>min</code>: Date | null = null</li>
          <li><code>max</code>: Date | null = null</li>
          <li><code>disabled</code>: Array&lt;Date&gt; | ((date: Date) =&gt; boolean) = []</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>invalid</code>: boolean = false</li>
          <li><code>firstDayOfWeek</code>: number = 0</li>
          <li><code>showWeekNumbers</code>: boolean = false</li>
        </ul>
      </details>
    </div>

    <!-- ErrorBoundary -->
    <div class="component-block">
      <div class="component-header">
        <h3>ErrorBoundary</h3>
        <p class="component-desc">ErrorBoundary Component Catches errors in child components and displays fallback UI. Integrates with...</p>
      </div>
      <div class="component-preview">
        <ErrorBoundary />
      </div>
      <details class="component-props">
        <summary>Props (6)</summary>
        <ul>
          <li><code>fallback</code>: any = null</li>
          <li><code>reportToServer</code>: boolean = false</li>
          <li><code>reportEvent</code>: string = 'client_error'</li>
          <li><code>showDetails</code>: boolean = import.meta.env?.DEV ?? false</li>
          <li><code>message</code>: string = 'Something went wrong'</li>
          <li><code>retryable</code>: boolean = true</li>
        </ul>
      </details>
    </div>

    <!-- FileUpload -->
    <div class="component-block">
      <div class="component-header">
        <h3>FileUpload</h3>
        <p class="component-desc">FileUpload Component Drag &amp; drop file upload with preview, progress, and validation.</p>
      </div>
      <div class="component-preview">
        <FileUpload />
      </div>
      <details class="component-props">
        <summary>Props (10)</summary>
        <ul>
          <li><code>accept</code>: string = ''</li>
          <li><code>multiple</code>: boolean = false</li>
          <li><code>maxSize</code>: number = 0</li>
          <li><code>maxFiles</code>: number = 0</li>
          <li><code>showPreview</code>: boolean = true</li>
          <li><code>disabled</code>: boolean = false</li>
          <li><code>files</code>: Array&lt;&#123; file: File, id: string, progress?: number, error?: string, url?: string = []</li>
          <li><code>uploadFn</code>: ((file: File) =&gt; Promise&lt;string&gt;) | null = null</li>
          <li><code>variant</code>: 'default' | 'compact' | 'avatar' = 'default'</li>
          <li><code>helperText</code>: string = ''</li>
        </ul>
      </details>
    </div>

    <!-- Meter -->
    <div class="component-block">
      <div class="component-header">
        <h3>Meter</h3>
        <p class="component-desc">Meter Component Circular or semi-circular gauge for displaying bounded values.</p>
      </div>
      <div class="component-preview">
        <Meter />
      </div>
      <details class="component-props">
        <summary>Props (15)</summary>
        <ul>
          <li><code>value</code>: number = 0</li>
          <li><code>min</code>: number = 0</li>
          <li><code>max</code>: number = 100</li>
          <li><code>type</code>: 'circle' | 'semicircle' | 'linear' = 'circle'</li>
          <li><code>size</code>: number = 120</li>
          <li><code>strokeWidth</code>: number = 10</li>
          <li><code>variant</code>: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'auto' = 'primary'</li>
          <li><code>thresholds</code>: &#123; warning: number, error: number = &#123; warning: 70, error: 90 &#125;</li>
          <li><code>showValue</code>: boolean = true</li>
          <li><code>showLabels</code>: boolean = false</li>
          <li><code>formatValue</code>: (value: number) =&gt; string = (v) =&gt; Math.round(v).toString()</li>
          <li><code>unit</code>: string = ''</li>
          <li><code>label</code>: string = ''</li>
          <li><code>animated</code>: boolean = true</li>
          <li><code>gradient</code>: boolean = false</li>
        </ul>
      </details>
    </div>

    <!-- MiniChart -->
    <div class="component-block">
      <div class="component-header">
        <h3>MiniChart</h3>
        <p class="component-desc">MiniChart Component Lightweight inline charts (sparkline, bar, dot) without external dependencies.</p>
      </div>
      <div class="component-preview">
        <MiniChart />
      </div>
      <details class="component-props">
        <summary>Props (11)</summary>
        <ul>
          <li><code>data</code>: Array&lt;number | &#123; value: number, label?: string = []</li>
          <li><code>type</code>: 'line' | 'bar' | 'dot' | 'area' = 'line'</li>
          <li><code>width</code>: number | 'auto' = 'auto'</li>
          <li><code>height</code>: number = 40</li>
          <li><code>showTooltip</code>: boolean = true</li>
          <li><code>variant</code>: 'primary' | 'success' | 'warning' | 'error' | 'info' = 'primary'</li>
          <li><code>fill</code>: boolean = false</li>
          <li><code>animated</code>: boolean = true</li>
          <li><code>showPoints</code>: boolean = false</li>
          <li><code>curve</code>: 'linear' | 'smooth' = 'smooth'</li>
          <li><code>formatValue</code>: (value: number) =&gt; string = (v) =&gt; v.toLocaleString()</li>
        </ul>
      </details>
    </div>

    <!-- NotificationCenter -->
    <div class="component-block">
      <div class="component-header">
        <h3>NotificationCenter</h3>
        <p class="component-desc">NotificationCenter Component Notification bell with dropdown panel showing notifications.</p>
      </div>
      <div class="component-preview">
        <NotificationCenter />
      </div>
      <details class="component-props">
        <summary>Props (7)</summary>
        <ul>
          <li><code>notifications</code>: Array&lt;&#123; id: string | number, title: string, message?: string, type?: 'info' | 'success' | 'warning' | 'error', read?: boolean, timestamp?: Date | string, href?: string, avatar?: string, icon?: string = []</li>
          <li><code>open</code>: boolean = false</li>
          <li><code>position</code>: 'left' | 'right' = 'right'</li>
          <li><code>showBadge</code>: boolean = true</li>
          <li><code>maxVisible</code>: number = 5</li>
          <li><code>emptyMessage</code>: string = 'No notifications'</li>
          <li><code>loading</code>: boolean = false</li>
        </ul>
      </details>
    </div>

    <!-- ProgressBar -->
    <div class="component-block">
      <div class="component-header">
        <h3>ProgressBar</h3>
        <p class="component-desc">ProgressBar Component Visual progress indicator with multiple variants and states.</p>
      </div>
      <div class="component-preview">
        <ProgressBar />
      </div>
      <details class="component-props">
        <summary>Props (14)</summary>
        <ul>
          <li><code>value</code>: number = 0</li>
          <li><code>max</code>: number = 100</li>
          <li><code>showLabel</code>: boolean = false</li>
          <li><code>labelPosition</code>: 'inside' | 'outside' | 'top' = 'outside'</li>
          <li><code>label</code>: string = ''</li>
          <li><code>variant</code>: 'primary' | 'success' | 'warning' | 'error' | 'info' = 'primary'</li>
          <li><code>size</code>: 'xs' | 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>animated</code>: boolean = true</li>
          <li><code>indeterminate</code>: boolean = false</li>
          <li><code>striped</code>: boolean = false</li>
          <li><code>stripedAnimated</code>: boolean = false</li>
          <li><code>segments</code>: number = 0</li>
          <li><code>rounded</code>: boolean = true</li>
          <li><code>description</code>: string = ''</li>
        </ul>
      </details>
    </div>

    <!-- RealtimeList -->
    <div class="component-block">
      <div class="component-header">
        <h3>RealtimeList</h3>
        <p class="component-desc">RealtimeList Component List that auto-syncs with server broadcasts. Supports optimistic updates with...</p>
      </div>
      <div class="component-preview">
        <RealtimeList />
      </div>
      <details class="component-props">
        <summary>Props (9)</summary>
        <ul>
          <li><code>store</code>: string (required)</li>
          <li><code>items</code>: Array&lt;&#123; id: string | number, [key: string]: any = []</li>
          <li><code>getId</code>: (item: any) =&gt; string | number = (item) =&gt; item.id</li>
          <li><code>sort</code>: ((a: any, b: any) =&gt; number) | null = null</li>
          <li><code>duration</code>: number = 300</li>
          <li><code>showOptimistic</code>: boolean = true</li>
          <li><code>optimisticAdd</code>: boolean = true</li>
          <li><code>addEvent</code>: string = 'add'</li>
          <li><code>removeEvent</code>: string = 'remove'</li>
        </ul>
      </details>
    </div>

    <!-- Sidebar -->
    <div class="component-block">
      <div class="component-header">
        <h3>Sidebar</h3>
        <p class="component-desc">Sidebar Component Responsive navigation sidebar with collapsible sections. Collapses to icon-only on...</p>
      </div>
      <div class="component-preview">
        <Sidebar />
      </div>
      <details class="component-props">
        <summary>Props (9)</summary>
        <ul>
          <li><code>items</code>: Array&lt;&#123; id: string, label: string, href?: string, icon?: string, badge?: string | number, active?: boolean, children?: Array&lt;&#123; id: string, label: string, href?: string, active?: boolean = []</li>
          <li><code>activeId</code>: string | null = null</li>
          <li><code>collapsed</code>: boolean = false</li>
          <li><code>mobileOpen</code>: boolean = false</li>
          <li><code>header</code>: &#123; logo?: string, title?: string, href?: string = null</li>
          <li><code>showFooter</code>: boolean = false</li>
          <li><code>gestureEnabled</code>: boolean = true</li>
          <li><code>width</code>: string = '16rem'</li>
          <li><code>collapsedWidth</code>: string = '4rem'</li>
        </ul>
      </details>
    </div>

    <!-- TypingIndicator -->
    <div class="component-block">
      <div class="component-header">
        <h3>TypingIndicator</h3>
        <p class="component-desc">TypingIndicator Component Shows who is currently typing with animated dots.</p>
      </div>
      <div class="component-preview">
        <TypingIndicator />
      </div>
      <details class="component-props">
        <summary>Props (3)</summary>
        <ul>
          <li><code>users</code>: Array&lt;&#123; id: string | number, name: string = []</li>
          <li><code>maxNames</code>: number = 2</li>
          <li><code>format</code>: ((users: Array&lt;&#123; name: string = null</li>
        </ul>
      </details>
    </div>
  </section>

  <!-- ANIMATION -->
  <section class="category-section">
    <h2>Animation Components</h2>
    
    <!-- AnimatedList -->
    <div class="component-block">
      <div class="component-header">
        <h3>AnimatedList</h3>
        <p class="component-desc">AnimatedList Component List with FLIP animations for add/remove/reorder. Items animate smoothly when...</p>
      </div>
      <div class="component-preview">
        <AnimatedList items={demoItems} animation="slide" let:item>
          <div style="padding: 8px; background: var(--color-surface-sunken); border-radius: 4px;">
            {item.name}
          </div>
        </AnimatedList>
      </div>
      <details class="component-props">
        <summary>Props (7)</summary>
        <ul>
          <li><code>items</code>: Array&lt;&#123; id: string | number, [key: string]: any = []</li>
          <li><code>key</code>: (item: any) =&gt; string | number = (item) =&gt; item.id</li>
          <li><code>animation</code>: 'fade' | 'slide' | 'scale' | 'fly' = 'slide'</li>
          <li><code>duration</code>: number = 300</li>
          <li><code>flipDuration</code>: number = 300</li>
          <li><code>direction</code>: 'up' | 'down' | 'left' | 'right' = 'up'</li>
          <li><code>stagger</code>: number = 0</li>
        </ul>
      </details>
    </div>
  </section>

  <!-- FORM -->
  <section class="category-section">
    <h2>Form Components</h2>
    
    <!-- AuthForm -->
    <div class="component-block">
      <div class="component-header">
        <h3>AuthForm</h3>
        <p class="component-desc">AuthForm Component Flexible authentication form supporting login, register, and forgot password mode...</p>
      </div>
      <div class="component-preview">
        <AuthForm />
      </div>
      <details class="component-props">
        <summary>Props (10)</summary>
        <ul>
          <li><code>mode</code>: 'login' | 'register' | 'forgot' | 'reset' = 'login'</li>
          <li><code>errors</code>: &#123; [field: string]: string = &#123;&#125;</li>
          <li><code>loading</code>: boolean = false</li>
          <li><code>showRemember</code>: boolean = true</li>
          <li><code>showOAuth</code>: boolean = true</li>
          <li><code>oauthProviders</code>: Array&lt;&#123; id: string, name: string, icon?: string = []</li>
          <li><code>showPasswordStrength</code>: boolean = true</li>
          <li><code>minPasswordLength</code>: number = 8</li>
          <li><code>submitEvent</code>: string = ''</li>
          <li><code>links</code>: &#123; login?: string, register?: string, forgot?: string = &#123;&#125;</li>
        </ul>
      </details>
    </div>

    <!-- Button -->
    <div class="component-block">
      <div class="component-header">
        <h3>Button</h3>
        <p class="component-desc">Button Component Primary interactive element with loading, success states, and iOS-style press feedb...</p>
      </div>
      <div class="component-preview">
        <div class="preview-row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
        </div>
      </div>
      <details class="component-props">
        <summary>Props (8)</summary>
        <ul>
          <li><code>variant</code>: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary'</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>disabled</code>: boolean = false</li>
          <li><code>loading</code>: boolean = false</li>
          <li><code>success</code>: boolean = false</li>
          <li><code>fullWidth</code>: boolean = false</li>
          <li><code>type</code>: 'button' | 'submit' | 'reset' = 'button'</li>
          <li><code>ariaLabel</code>: string | null = null</li>
        </ul>
      </details>
    </div>

    <!-- Checkbox -->
    <div class="component-block">
      <div class="component-header">
        <h3>Checkbox</h3>
        <p class="component-desc">Checkbox Component Controlled checkbox with label support. NO class prop - consistent styling enforc...</p>
      </div>
      <div class="component-preview">
        <Checkbox />
      </div>
      <details class="component-props">
        <summary>Props (7)</summary>
        <ul>
          <li><code>checked</code>: boolean = false</li>
          <li><code>label</code>: string | null = null</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>disabled</code>: boolean = false</li>
          <li><code>name</code>: string | null = null</li>
          <li><code>id</code>: string = `checkbox-$&#123;Math.random().toString(36).slice(2, 9)&#125;`</li>
          <li><code>description</code>: string | null = null</li>
        </ul>
      </details>
    </div>

    <!-- Form -->
    <div class="component-block">
      <div class="component-header">
        <h3>Form</h3>
        <p class="component-desc">Form Component Form wrapper with validation, loading state, and context for child components. Auto-d...</p>
      </div>
      <div class="component-preview">
        <Form />
      </div>
      <details class="component-props">
        <summary>Props (5)</summary>
        <ul>
          <li><code>valid</code>: boolean = false</li>
          <li><code>submitting</code>: boolean = false</li>
          <li><code>disableWhenInvalid</code>: boolean = true</li>
          <li><code>showSuccess</code>: boolean = true</li>
          <li><code>successDuration</code>: number = 1500</li>
        </ul>
      </details>
    </div>

    <!-- FormField -->
    <div class="component-block">
      <div class="component-header">
        <h3>FormField</h3>
        <p class="component-desc">FormField Component Consistent wrapper for form inputs with label, error, and helper text. Integrate...</p>
      </div>
      <div class="component-preview">
        <FormField />
      </div>
      <details class="component-props">
        <summary>Props (7)</summary>
        <ul>
          <li><code>label</code>: string = ''</li>
          <li><code>name</code>: string = `field-$&#123;Math.random().toString(36).slice(2, 9)&#125;`</li>
          <li><code>error</code>: string | null = null</li>
          <li><code>helper</code>: string | null = null</li>
          <li><code>required</code>: boolean = false</li>
          <li><code>disabled</code>: boolean = false</li>
          <li><code>rules</code>: Array = []</li>
        </ul>
      </details>
    </div>

    <!-- Input -->
    <div class="component-block">
      <div class="component-header">
        <h3>Input</h3>
        <p class="component-desc">Input Component Controlled text input with consistent styling. NO class prop - use size/variant prop...</p>
      </div>
      <div class="component-preview">
        <div class="preview-stack" style="max-width: 300px">
          <Input placeholder="Default input" bind:value={inputValue} />
          <Input size="sm" placeholder="Small" />
          <Input invalid placeholder="Invalid" />
        </div>
      </div>
      <details class="component-props">
        <summary>Props (10)</summary>
        <ul>
          <li><code>type</code>: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number' = 'text'</li>
          <li><code>value</code>: string = ''</li>
          <li><code>placeholder</code>: string = ''</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>disabled</code>: boolean = false</li>
          <li><code>required</code>: boolean = false</li>
          <li><code>invalid</code>: boolean = false</li>
          <li><code>name</code>: string | null = null</li>
          <li><code>id</code>: string = `input-$&#123;Math.random().toString(36).slice(2, 9)&#125;`</li>
          <li><code>describedBy</code>: string | null = null</li>
        </ul>
      </details>
    </div>

    <!-- OAuthButton -->
    <div class="component-block">
      <div class="component-header">
        <h3>OAuthButton</h3>
        <p class="component-desc">OAuthButton Component Pre-styled buttons for common OAuth providers. Includes official brand colors...</p>
      </div>
      <div class="component-preview">
        <OAuthButton />
      </div>
      <details class="component-props">
        <summary>Props (7)</summary>
        <ul>
          <li><code>provider</code>: 'google' | 'github' | 'apple' | 'microsoft' | 'facebook' | 'twitter' | 'discord' | 'slack' (required)</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>iconOnly</code>: boolean = false</li>
          <li><code>label</code>: string | null = null</li>
          <li><code>loading</code>: boolean = false</li>
          <li><code>disabled</code>: boolean = false</li>
          <li><code>fullWidth</code>: boolean = false</li>
        </ul>
      </details>
    </div>

    <!-- SearchInput -->
    <div class="component-block">
      <div class="component-header">
        <h3>SearchInput</h3>
        <p class="component-desc">SearchInput Component Search input with suggestions dropdown and keyboard navigation.</p>
      </div>
      <div class="component-preview">
        <SearchInput />
      </div>
      <details class="component-props">
        <summary>Props (13)</summary>
        <ul>
          <li><code>value</code>: string = ''</li>
          <li><code>placeholder</code>: string = 'Search...'</li>
          <li><code>suggestions</code>: Array&lt;&#123; id: string | number, label: string, description?: string, icon?: string, group?: string = []</li>
          <li><code>loading</code>: boolean = false</li>
          <li><code>minChars</code>: number = 1</li>
          <li><code>debounce</code>: number = 300</li>
          <li><code>maxSuggestions</code>: number = 10</li>
          <li><code>clearable</code>: boolean = true</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>disabled</code>: boolean = false</li>
          <li><code>showRecent</code>: boolean = true</li>
          <li><code>maxRecent</code>: number = 5</li>
          <li><code>storageKey</code>: string = 'search-recent'</li>
        </ul>
      </details>
    </div>

    <!-- Select -->
    <div class="component-block">
      <div class="component-header">
        <h3>Select</h3>
        <p class="component-desc">Select Component Controlled dropdown select with consistent styling. NO class prop - use size prop f...</p>
      </div>
      <div class="component-preview">
        <Select />
      </div>
      <details class="component-props">
        <summary>Props (10)</summary>
        <ul>
          <li><code>value</code>: string = ''</li>
          <li><code>options</code>: Array&lt;&#123;value: string, label: string, disabled?: boolean = []</li>
          <li><code>placeholder</code>: string = 'Select...'</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>disabled</code>: boolean = false</li>
          <li><code>required</code>: boolean = false</li>
          <li><code>invalid</code>: boolean = false</li>
          <li><code>name</code>: string | null = null</li>
          <li><code>id</code>: string = `select-$&#123;Math.random().toString(36).slice(2, 9)&#125;`</li>
          <li><code>describedBy</code>: string | null = null</li>
        </ul>
      </details>
    </div>

    <!-- SubmitButton -->
    <div class="component-block">
      <div class="component-header">
        <h3>SubmitButton</h3>
        <p class="component-desc">SubmitButton Component Form submit button that auto-wires to Form context. Shows loading, disabled (...</p>
      </div>
      <div class="component-preview">
        <SubmitButton />
      </div>
      <details class="component-props">
        <summary>Props (6)</summary>
        <ul>
          <li><code>variant</code>: 'primary' | 'secondary' | 'danger' = 'primary'</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>fullWidth</code>: boolean = false</li>
          <li><code>loadingText</code>: string = ''</li>
          <li><code>successText</code>: string = 'Done!'</li>
          <li><code>disabled</code>: boolean = false</li>
        </ul>
      </details>
    </div>

    <!-- Textarea -->
    <div class="component-block">
      <div class="component-header">
        <h3>Textarea</h3>
        <p class="component-desc">Textarea Component Controlled textarea with consistent styling. NO class prop - use size prop for cu...</p>
      </div>
      <div class="component-preview">
        <Textarea />
      </div>
      <details class="component-props">
        <summary>Props (11)</summary>
        <ul>
          <li><code>value</code>: string = ''</li>
          <li><code>placeholder</code>: string = ''</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>rows</code>: number = 3</li>
          <li><code>disabled</code>: boolean = false</li>
          <li><code>required</code>: boolean = false</li>
          <li><code>invalid</code>: boolean = false</li>
          <li><code>resizable</code>: boolean = true</li>
          <li><code>name</code>: string | null = null</li>
          <li><code>id</code>: string = `textarea-$&#123;Math.random().toString(36).slice(2, 9)&#125;`</li>
          <li><code>describedBy</code>: string | null = null</li>
        </ul>
      </details>
    </div>

    <!-- Toggle -->
    <div class="component-block">
      <div class="component-header">
        <h3>Toggle</h3>
        <p class="component-desc">Toggle/Switch Component iOS-style toggle with spring animation and haptic feedback.</p>
      </div>
      <div class="component-preview">
        <div class="preview-stack">
          <Toggle bind:checked={toggleChecked} label="Enable notifications" />
          <Toggle size="sm" label="Small toggle" />
          <Toggle size="lg" label="Large toggle" />
        </div>
      </div>
      <details class="component-props">
        <summary>Props (7)</summary>
        <ul>
          <li><code>checked</code>: boolean = false</li>
          <li><code>disabled</code>: boolean = false</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>label</code>: string = ''</li>
          <li><code>description</code>: string = ''</li>
          <li><code>id</code>: string | undefined = undefined</li>
          <li><code>name</code>: string | undefined = undefined</li>
        </ul>
      </details>
    </div>
  </section>

  <!-- DISPLAY -->
  <section class="category-section">
    <h2>Display Components</h2>
    
    <!-- Avatar -->
    <div class="component-block">
      <div class="component-header">
        <h3>Avatar</h3>
        <p class="component-desc">Avatar Component User representation with image, initials, and optional status. NO class prop or res...</p>
      </div>
      <div class="component-preview">
        <div class="preview-row">
          <Avatar size="xs" />
          <Avatar size="sm" />
          <Avatar size="md" />
          <Avatar size="lg" />
          <Avatar size="xl" />
        </div>
      </div>
      <details class="component-props">
        <summary>Props (6)</summary>
        <ul>
          <li><code>size</code>: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'</li>
          <li><code>src</code>: string | null = null</li>
          <li><code>alt</code>: string = ''</li>
          <li><code>fallback</code>: string | null = null</li>
          <li><code>shape</code>: 'circle' | 'rounded' = 'circle'</li>
          <li><code>status</code>: 'online' | 'offline' | 'away' | 'busy' | null = null</li>
        </ul>
      </details>
    </div>

    <!-- Badge -->
    <div class="component-block">
      <div class="component-header">
        <h3>Badge</h3>
        <p class="component-desc">Badge Component Status indicators, labels, and tags. NO class prop - use variant/size props only.</p>
      </div>
      <div class="component-preview">
        <div class="preview-row">
          <Badge>Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
        </div>
      </div>
      <details class="component-props">
        <summary>Props (3)</summary>
        <ul>
          <li><code>variant</code>: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' = 'default'</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>dot</code>: boolean = false</li>
        </ul>
      </details>
    </div>

    <!-- EmptyState -->
    <div class="component-block">
      <div class="component-header">
        <h3>EmptyState</h3>
        <p class="component-desc">EmptyState Component Displays a placeholder when content is empty or unavailable. Supports various p...</p>
      </div>
      <div class="component-preview">
        <EmptyState preset="search" title="No results" size="sm" compact />
      </div>
      <details class="component-props">
        <summary>Props (5)</summary>
        <ul>
          <li><code>preset</code>: 'default' | 'search' | 'error' | 'success' | 'offline' | 'custom' = 'default'</li>
          <li><code>title</code>: string = ''</li>
          <li><code>description</code>: string = ''</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>compact</code>: boolean = false</li>
        </ul>
      </details>
    </div>

    <!-- Skeleton -->
    <div class="component-block">
      <div class="component-header">
        <h3>Skeleton</h3>
        <p class="component-desc">Skeleton Component Animated loading placeholder with shimmer effect. Supports various shapes and siz...</p>
      </div>
      <div class="component-preview">
        <div class="preview-stack" style="max-width: 300px">
          <Skeleton variant="text" lines={3} />
          <div class="preview-row">
            <Skeleton variant="avatar" />
            <Skeleton variant="button" />
          </div>
        </div>
      </div>
      <details class="component-props">
        <summary>Props (7)</summary>
        <ul>
          <li><code>variant</code>: 'text' | 'circle' | 'rect' | 'card' | 'avatar' | 'button' = 'text'</li>
          <li><code>width</code>: string = ''</li>
          <li><code>height</code>: string = ''</li>
          <li><code>lines</code>: number = 1</li>
          <li><code>size</code>: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'</li>
          <li><code>animate</code>: boolean = true</li>
          <li><code>rounded</code>: boolean = true</li>
        </ul>
      </details>
    </div>
  </section>

  <!-- LAYOUT -->
  <section class="category-section">
    <h2>Layout Components</h2>
    
    <!-- Card -->
    <div class="component-block">
      <div class="component-header">
        <h3>Card</h3>
        <p class="component-desc">Card Component Consistent card container with optional header and footer. NO class prop - use varian...</p>
      </div>
      <div class="component-preview">
        <Card title="Card Title" description="Card description text">
          <p>Card content goes here</p>
        </Card>
      </div>
      <details class="component-props">
        <summary>Props (4)</summary>
        <ul>
          <li><code>variant</code>: 'default' | 'raised' | 'outline' | 'ghost' = 'default'</li>
          <li><code>padding</code>: 'sm' | 'md' | 'lg' | 'none' = 'md'</li>
          <li><code>title</code>: string | null = null</li>
          <li><code>description</code>: string | null = null</li>
        </ul>
      </details>
    </div>

    <!-- Page -->
    <div class="component-block">
      <div class="component-header">
        <h3>Page</h3>
        <p class="component-desc">Page Component Consistent page wrapper with max-width and padding. Enforces layout rhythm across all...</p>
      </div>
      <div class="component-preview">
        <Page />
      </div>
      <details class="component-props">
        <summary>Props (3)</summary>
        <ul>
          <li><code>size</code>: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'lg'</li>
          <li><code>padded</code>: boolean = true</li>
          <li><code>centered</code>: boolean = true</li>
        </ul>
      </details>
    </div>

    <!-- PageHeader -->
    <div class="component-block">
      <div class="component-header">
        <h3>PageHeader</h3>
        <p class="component-desc">PageHeader Component Consistent page header with title, description, and action slot. Enforces heade...</p>
      </div>
      <div class="component-preview">
        <PageHeader />
      </div>
      <details class="component-props">
        <summary>Props (3)</summary>
        <ul>
          <li><code>title</code>: string (required)</li>
          <li><code>description</code>: string | null = null</li>
          <li><code>bordered</code>: boolean = false</li>
        </ul>
      </details>
    </div>

    <!-- Section -->
    <div class="component-block">
      <div class="component-header">
        <h3>Section</h3>
        <p class="component-desc">Section Component Consistent vertical rhythm for page sections. Enforces spacing between major page...</p>
      </div>
      <div class="component-preview">
        <Section />
      </div>
      <details class="component-props">
        <summary>Props (3)</summary>
        <ul>
          <li><code>title</code>: string | null = null</li>
          <li><code>description</code>: string | null = null</li>
          <li><code>spacing</code>: 'sm' | 'md' | 'lg' = 'md'</li>
        </ul>
      </details>
    </div>

    <!-- StatCard -->
    <div class="component-block">
      <div class="component-header">
        <h3>StatCard</h3>
        <p class="component-desc">StatCard Component Display key metrics/KPIs with optional trend indicator and sparkline.</p>
      </div>
      <div class="component-preview">
        <StatCard />
      </div>
      <details class="component-props">
        <summary>Props (15)</summary>
        <ul>
          <li><code>label</code>: string = ''</li>
          <li><code>value</code>: string | number = ''</li>
          <li><code>previousValue</code>: string | number | null = null</li>
          <li><code>format</code>: 'number' | 'currency' | 'percent' | 'custom' = 'number'</li>
          <li><code>currency</code>: string = 'USD'</li>
          <li><code>decimals</code>: number = 0</li>
          <li><code>prefix</code>: string = ''</li>
          <li><code>suffix</code>: string = ''</li>
          <li><code>description</code>: string = ''</li>
          <li><code>icon</code>: string = ''</li>
          <li><code>iconColor</code>: 'primary' | 'success' | 'warning' | 'error' | 'info' = 'primary'</li>
          <li><code>sparkline</code>: number[] = []</li>
          <li><code>loading</code>: boolean = false</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>inverseTrend</code>: boolean = false</li>
        </ul>
      </details>
    </div>
  </section>

  <!-- DATA -->
  <section class="category-section">
    <h2>Data Components</h2>
    
    <!-- DataTable -->
    <div class="component-block">
      <div class="component-header">
        <h3>DataTable</h3>
        <p class="component-desc">DataTable Component Responsive data table with sorting, selection, and mobile card view.</p>
      </div>
      <div class="component-preview">
        <DataTable columns={demoColumns} data={demoItems} />
      </div>
      <details class="component-props">
        <summary>Props (11)</summary>
        <ul>
          <li><code>columns</code>: Array&lt;&#123; key: string, label: string, sortable?: boolean, width?: string, align?: 'left' | 'center' | 'right', hidden?: boolean, primary?: boolean = []</li>
          <li><code>data</code>: Array&lt;&#123; id: string | number, [key: string]: any = []</li>
          <li><code>selectable</code>: boolean = false</li>
          <li><code>selected</code>: Array&lt;string | number&gt; = []</li>
          <li><code>sortBy</code>: string | null = null</li>
          <li><code>sortDirection</code>: 'asc' | 'desc' = 'asc'</li>
          <li><code>loading</code>: boolean = false</li>
          <li><code>skeletonRows</code>: number = 5</li>
          <li><code>striped</code>: boolean = false</li>
          <li><code>hoverable</code>: boolean = true</li>
          <li><code>mobileCards</code>: boolean = true</li>
        </ul>
      </details>
    </div>

    <!-- InfiniteScroll -->
    <div class="component-block">
      <div class="component-header">
        <h3>InfiniteScroll</h3>
        <p class="component-desc">InfiniteScroll Component Infinite scrolling with pull-to-refresh support. Uses IntersectionObserver...</p>
      </div>
      <div class="component-preview">
        <p style="color: var(--color-text-muted)">Wrap content for infinite loading</p>
      </div>
      <details class="component-props">
        <summary>Props (9)</summary>
        <ul>
          <li><code>loading</code>: boolean = false</li>
          <li><code>hasMore</code>: boolean = true</li>
          <li><code>pullToRefresh</code>: boolean = true</li>
          <li><code>threshold</code>: number = 200</li>
          <li><code>pullThreshold</code>: number = 80</li>
          <li><code>loadingText</code>: string = 'Loading...'</li>
          <li><code>pullText</code>: string = 'Pull to refresh'</li>
          <li><code>releaseText</code>: string = 'Release to refresh'</li>
          <li><code>refreshingText</code>: string = 'Refreshing...'</li>
        </ul>
      </details>
    </div>

    <!-- Pagination -->
    <div class="component-block">
      <div class="component-header">
        <h3>Pagination</h3>
        <p class="component-desc">Pagination Component Accessible pagination with various display modes. Optimized for both desktop an...</p>
      </div>
      <div class="component-preview">
        <Pagination page={1} totalPages={10} totalItems={100} />
      </div>
      <details class="component-props">
        <summary>Props (9)</summary>
        <ul>
          <li><code>page</code>: number = 1</li>
          <li><code>totalPages</code>: number = 1</li>
          <li><code>totalItems</code>: number = 0</li>
          <li><code>pageSize</code>: number = 10</li>
          <li><code>mode</code>: 'full' | 'simple' | 'minimal' = 'full'</li>
          <li><code>siblingCount</code>: number = 1</li>
          <li><code>showPageSize</code>: boolean = false</li>
          <li><code>pageSizes</code>: number[] = [10, 25, 50, 100]</li>
          <li><code>showCount</code>: boolean = true</li>
        </ul>
      </details>
    </div>
  </section>

  <!-- INTERACTIVE -->
  <section class="category-section">
    <h2>Interactive Components</h2>
    
    <!-- Dropdown -->
    <div class="component-block">
      <div class="component-header">
        <h3>Dropdown</h3>
        <p class="component-desc">Dropdown Component Accessible dropdown menu that becomes a Sheet on mobile. Supports keyboard naviga...</p>
      </div>
      <div class="component-preview">
        <Dropdown items={dropdownItems} bind:open={dropdownOpen} title="Actions">
          <Button slot="trigger" variant="secondary">Open Menu</Button>
        </Dropdown>
      </div>
      <details class="component-props">
        <summary>Props (5)</summary>
        <ul>
          <li><code>open</code>: boolean = false</li>
          <li><code>items</code>: Array&lt;&#123; id: string, label: string, icon?: string, disabled?: boolean, danger?: boolean, separator?: boolean = []</li>
          <li><code>align</code>: 'left' | 'right' = 'left'</li>
          <li><code>title</code>: string = ''</li>
          <li><code>mobileSheet</code>: boolean = true</li>
        </ul>
      </details>
    </div>

    <!-- Modal -->
    <div class="component-block">
      <div class="component-header">
        <h3>Modal</h3>
        <p class="component-desc">Modal Component iOS-style modal with spring animations and gesture dismiss. Accessible, keyboard nav...</p>
      </div>
      <div class="component-preview">
        <div>
          <Button on:click={() => modalOpen = true}>Open Modal</Button>
          <Modal bind:open={modalOpen} title="Modal Title">
            <p>Modal content</p>
          </Modal>
        </div>
      </div>
      <details class="component-props">
        <summary>Props (8)</summary>
        <ul>
          <li><code>open</code>: boolean = false</li>
          <li><code>title</code>: string = ''</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' | 'full' = 'md'</li>
          <li><code>showClose</code>: boolean = true</li>
          <li><code>closeOnBackdrop</code>: boolean = true</li>
          <li><code>closeOnEscape</code>: boolean = true</li>
          <li><code>preventScroll</code>: boolean = true</li>
          <li><code>gestureEnabled</code>: boolean = false</li>
        </ul>
      </details>
    </div>

    <!-- Sheet -->
    <div class="component-block">
      <div class="component-header">
        <h3>Sheet</h3>
        <p class="component-desc">Sheet Component (iOS-style) Bottom sheet with gesture dismiss, snap points, and spring animation. Mo...</p>
      </div>
      <div class="component-preview">
        <div>
          <Button on:click={() => sheetOpen = true}>Open Sheet</Button>
          <Sheet bind:open={sheetOpen} title="Sheet Title">
            <p>Sheet content with gesture dismiss</p>
          </Sheet>
        </div>
      </div>
      <details class="component-props">
        <summary>Props (9)</summary>
        <ul>
          <li><code>open</code>: boolean = false</li>
          <li><code>title</code>: string = ''</li>
          <li><code>showClose</code>: boolean = true</li>
          <li><code>closeOnBackdrop</code>: boolean = true</li>
          <li><code>closeOnEscape</code>: boolean = true</li>
          <li><code>gestureEnabled</code>: boolean = true</li>
          <li><code>dismissThreshold</code>: number = 0.3</li>
          <li><code>snapPoints</code>: Array&lt;number&gt; = [1]</li>
          <li><code>initialSnap</code>: number = 0</li>
        </ul>
      </details>
    </div>

    <!-- Tabs -->
    <div class="component-block">
      <div class="component-header">
        <h3>Tabs</h3>
        <p class="component-desc">Tabs Component Animated tabs with sliding indicator. Supports both controlled and uncontrolled modes...</p>
      </div>
      <div class="component-preview">
        <Tabs tabs={demoTabs} value="tab1" />
      </div>
      <details class="component-props">
        <summary>Props (5)</summary>
        <ul>
          <li><code>tabs</code>: Array&lt;&#123; id: string, label: string, disabled?: boolean, icon?: string = []</li>
          <li><code>value</code>: string = ''</li>
          <li><code>variant</code>: 'underline' | 'pill' | 'segment' = 'underline'</li>
          <li><code>size</code>: 'sm' | 'md' | 'lg' = 'md'</li>
          <li><code>fullWidth</code>: boolean = false</li>
        </ul>
      </details>
    </div>
  </section>

  <!-- FEEDBACK -->
  <section class="category-section">
    <h2>Feedback Components</h2>
    
    <!-- Toast -->
    <div class="component-block">
      <div class="component-header">
        <h3>Toast</h3>
        <p class="component-desc">Toast Component Individual toast notification with animation.</p>
      </div>
      <div class="component-preview">
        <Button on:click={() => toast.success('Success!')}>Show Toast</Button>
      </div>
      <details class="component-props">
        <summary>Props (4)</summary>
        <ul>
          <li><code>message</code>: string = ''</li>
          <li><code>variant</code>: 'success' | 'error' | 'warning' | 'info' = 'info'</li>
          <li><code>dismissible</code>: boolean = true</li>
          <li><code>action</code>: &#123; label: string, onClick: () =&gt; void = null</li>
        </ul>
      </details>
    </div>

    <!-- ToastContainer -->
    <div class="component-block">
      <div class="component-header">
        <h3>ToastContainer</h3>
        <p class="component-desc">ToastContainer Component Container for toast notifications. Place once in your layout. Usage: &lt;scri...</p>
      </div>
      <div class="component-preview">
        <p style="color: var(--color-text-muted)">Add &lt;ToastContainer /&gt; to app root</p>
      </div>
      <details class="component-props">
        <summary>Props (1)</summary>
        <ul>
          <li><code>position</code>: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' = 'top-right'</li>
        </ul>
      </details>
    </div>
  </section>
  </main>
</div>

<style>
  .playground {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-6);
    font-family: system-ui, sans-serif;
  }

  .playground-header {
    margin-bottom: var(--spacing-8);
    padding-bottom: var(--spacing-4);
    border-bottom: 1px solid var(--color-border);
  }

  .playground-header h1 {
    margin: 0 0 var(--spacing-2);
    font-size: 2rem;
  }

  .playground-header p {
    margin: 0;
    color: var(--color-text-muted);
  }

  .playground-nav {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    gap: var(--spacing-4);
    padding: var(--spacing-3) 0;
    margin-bottom: var(--spacing-6);
    background: var(--color-background);
    border-bottom: 1px solid var(--color-border);
  }

  .playground-nav a {
    padding: var(--spacing-2) var(--spacing-3);
    color: var(--color-text-muted);
    text-decoration: none;
    border-radius: var(--radius-md);
    text-transform: capitalize;
  }

  .playground-nav a:hover {
    color: var(--color-text);
    background: var(--color-surface-sunken);
  }

  .category-section {
    margin-bottom: var(--spacing-12);
  }

  .category-section h2 {
    margin: 0 0 var(--spacing-6);
    padding-bottom: var(--spacing-2);
    font-size: 1.5rem;
    border-bottom: 2px solid var(--color-primary);
  }

  .component-block {
    margin-bottom: var(--spacing-8);
    padding: var(--spacing-4);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .component-header {
    margin-bottom: var(--spacing-4);
  }

  .component-header h3 {
    margin: 0 0 var(--spacing-1);
    font-size: 1.125rem;
  }

  .component-desc {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .component-preview {
    padding: var(--spacing-6);
    background: var(--color-background);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-4);
  }

  .component-props {
    font-size: 0.875rem;
  }

  .component-props summary {
    cursor: pointer;
    padding: var(--spacing-2);
    color: var(--color-text-muted);
  }

  .component-props ul {
    margin: var(--spacing-2) 0 0;
    padding-left: var(--spacing-6);
  }

  .component-props li {
    margin-bottom: var(--spacing-1);
  }

  .component-props code {
    padding: 0.125rem 0.25rem;
    background: var(--color-surface-sunken);
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
  }

  .preview-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3);
    align-items: center;
  }

  .preview-stack {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }
</style>
