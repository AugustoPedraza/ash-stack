<script>
  import { DropdownMenu, Dialog, Switch } from 'bits-ui';

  let darkMode = $state(false);
  let dropdownOpen = $state(false);
  let modalOpen = $state(false);
  let switchOn = $state(true);

  function toggleTheme() {
    darkMode = !darkMode;
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }
</script>

<div class="min-h-screen bg-background p-4 md:p-8">
  <div class="max-w-4xl mx-auto space-y-8">

    <!-- Header -->
    <header class="text-center space-y-2">
      <h1 class="text-4xl font-bold text-foreground">FlyonUI + Bits UI</h1>
      <p class="text-muted-foreground">FlyonUI styling + Bits UI interactive components</p>
      <button class="btn btn-sm btn-outline" onclick={toggleTheme}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </header>

    <!-- Buttons Section (FlyonUI CSS) -->
    <section class="card bg-muted shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Buttons (FlyonUI CSS)</h2>
        <div class="flex flex-wrap gap-3">
          <button class="btn btn-primary">Primary</button>
          <button class="btn btn-secondary">Secondary</button>
          <button class="btn btn-accent">Accent</button>
          <button class="btn btn-success">Success</button>
          <button class="btn btn-warning">Warning</button>
          <button class="btn btn-error">Error</button>
          <button class="btn btn-ghost">Ghost</button>
          <button class="btn btn-outline">Outline</button>
        </div>
        <div class="flex flex-wrap gap-3 mt-4">
          <button class="btn btn-primary btn-sm">Small</button>
          <button class="btn btn-primary">Default</button>
          <button class="btn btn-primary btn-lg">Large</button>
        </div>
      </div>
    </section>

    <!-- Form Inputs Section (FlyonUI CSS) -->
    <section class="card bg-muted shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Form Inputs (FlyonUI CSS)</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control w-full">
            <label class="label" for="email">
              <span class="label-text">Email</span>
            </label>
            <input id="email" type="email" placeholder="you@example.com" class="input input-bordered w-full" />
          </div>
          <div class="form-control w-full">
            <label class="label" for="password">
              <span class="label-text">Password</span>
            </label>
            <input id="password" type="password" placeholder="Enter password" class="input input-bordered w-full" />
          </div>
          <div class="form-control w-full">
            <label class="label" for="select">
              <span class="label-text">Select Option</span>
            </label>
            <select id="select" class="select select-bordered w-full">
              <option disabled selected>Choose one</option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
          <div class="form-control w-full">
            <label class="label" for="message">
              <span class="label-text">Message</span>
            </label>
            <textarea id="message" class="textarea textarea-bordered w-full" placeholder="Your message..."></textarea>
          </div>
        </div>
      </div>
    </section>

    <!-- Switch (Bits UI + FlyonUI styling) -->
    <section class="card bg-muted shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Switch (Bits UI)</h2>
        <div class="flex items-center gap-4">
          <Switch.Root
            bind:checked={switchOn}
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {switchOn ? 'bg-primary' : 'bg-accent'}"
          >
            <Switch.Thumb
              class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform {switchOn ? 'translate-x-5' : 'translate-x-1'}"
            />
          </Switch.Root>
          <span class="label-text">Notifications: {switchOn ? 'ON' : 'OFF'}</span>
        </div>
      </div>
    </section>

    <!-- Progress & Range (FlyonUI CSS) -->
    <section class="card bg-muted shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Progress & Range (FlyonUI CSS)</h2>
        <div class="space-y-4">
          <div>
            <span class="text-sm text-muted-foreground">Loading: 70%</span>
            <progress class="progress progress-primary w-full" value="70" max="100"></progress>
          </div>
          <div>
            <span class="text-sm text-muted-foreground">Success: 100%</span>
            <progress class="progress progress-success w-full" value="100" max="100"></progress>
          </div>
          <div>
            <span class="text-sm text-muted-foreground">Range Slider</span>
            <input type="range" min="0" max="100" value="40" class="range range-primary" />
          </div>
        </div>
      </div>
    </section>

    <!-- Badges (FlyonUI CSS) -->
    <section class="card bg-muted shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Badges (FlyonUI CSS)</h2>
        <div class="flex flex-wrap gap-2">
          <span class="badge badge-primary">Primary</span>
          <span class="badge badge-secondary">Secondary</span>
          <span class="badge badge-accent">Accent</span>
          <span class="badge badge-success">Success</span>
          <span class="badge badge-warning">Warning</span>
          <span class="badge badge-error">Error</span>
          <span class="badge badge-outline">Outline</span>
        </div>
      </div>
    </section>

    <!-- Alerts (FlyonUI CSS) -->
    <section class="space-y-3">
      <div class="alert alert-info">
        <span>Info: This is an informational message.</span>
      </div>
      <div class="alert alert-success">
        <span>Success: Operation completed successfully!</span>
      </div>
      <div class="alert alert-warning">
        <span>Warning: Please review before continuing.</span>
      </div>
      <div class="alert alert-error">
        <span>Error: Something went wrong.</span>
      </div>
    </section>

    <!-- Dropdown (Bits UI + FlyonUI styling) -->
    <section class="card bg-muted shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Dropdown (Bits UI)</h2>
        <DropdownMenu.Root bind:open={dropdownOpen}>
          <DropdownMenu.Trigger class="btn btn-primary">
            Click me
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              class="z-50 min-w-48 rounded-lg border border-accent bg-background p-1 shadow-lg"
              sideOffset={4}
            >
              <DropdownMenu.Item class="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-muted focus:bg-muted focus:outline-none">
                Action 1
              </DropdownMenu.Item>
              <DropdownMenu.Item class="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-muted focus:bg-muted focus:outline-none">
                Action 2
              </DropdownMenu.Item>
              <DropdownMenu.Item class="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-muted focus:bg-muted focus:outline-none">
                Action 3
              </DropdownMenu.Item>
              <DropdownMenu.Separator class="my-1 h-px bg-accent" />
              <DropdownMenu.Item class="cursor-pointer rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:outline-none">
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <p class="text-sm text-muted-foreground mt-2">Dropdown open: {dropdownOpen}</p>
      </div>
    </section>

    <!-- Modal (Bits UI + FlyonUI styling) -->
    <section class="card bg-muted shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Modal (Bits UI)</h2>
        <Dialog.Root bind:open={modalOpen}>
          <Dialog.Trigger class="btn btn-primary">
            Open Modal
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
            <Dialog.Content class="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background p-6 shadow-xl">
              <Dialog.Title class="text-lg font-bold">Hello!</Dialog.Title>
              <Dialog.Description class="mt-2 text-muted-foreground">
                This is a modal dialog powered by Bits UI with FlyonUI styling.
                Press ESC or click outside to close.
              </Dialog.Description>
              <div class="mt-6 flex justify-end gap-3">
                <Dialog.Close class="btn btn-ghost">Cancel</Dialog.Close>
                <button class="btn btn-primary" onclick={() => modalOpen = false}>Confirm</button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <p class="text-sm text-muted-foreground mt-2">Modal open: {modalOpen}</p>
      </div>
    </section>

    <!-- Avatar (FlyonUI CSS) -->
    <section class="card bg-muted shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Avatars (FlyonUI CSS)</h2>
        <div class="flex gap-4 items-center">
          <div class="avatar">
            <div class="w-12 rounded-full">
              <img src="https://i.pravatar.cc/150?img=1" alt="Avatar" />
            </div>
          </div>
          <div class="avatar">
            <div class="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src="https://i.pravatar.cc/150?img=2" alt="Avatar" />
            </div>
          </div>
          <div class="w-12 h-12 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
            <span class="text-sm font-medium">JD</span>
          </div>
          <div class="avatar online">
            <div class="w-12 rounded-full">
              <img src="https://i.pravatar.cc/150?img=3" alt="Avatar" />
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</div>
