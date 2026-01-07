/**
 * Mock Data Generators
 * Deterministic fake data generation (no external dependencies)
 */

const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Taylor'];
const domains = ['example.com', 'test.io', 'demo.app', 'mail.org'];

// Professional color palette for avatars (corporate blues, grays, greens)
const avatarColors = ['0066CC', '2563EB', '0891B2', '059669', '4F46E5', '6366F1', '7C3AED', '0D9488', '475569', '64748B'];

let idCounter = 1;

/** Generate unique ID */
export function generateId() {
  return `mock_${idCounter++}`;
}

/** Reset ID counter (useful for tests) */
export function resetIdCounter() {
  idCounter = 1;
}

/** Pick random item from array */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Generate random date within days ago */
function randomDate(daysAgo = 30) {
  return new Date(Date.now() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
}

/**
 * Generate a mock user
 * @param {Partial<User>} [overrides]
 * @returns {User}
 */
export function generateUser(overrides = {}) {
  const firstName = pick(firstNames);
  const lastName = pick(lastNames);
  const id = generateId();
  const bgColor = pick(avatarColors);
  const name = `${firstName} ${lastName}`;

  return {
    id,
    name,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${pick(domains)}`,
    // Professional initials-based avatar (UI Avatars)
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=ffffff&bold=true&size=128`,
    status: pick(['online', 'offline', 'away']),
    role: pick(['admin', 'user', 'moderator']),
    createdAt: randomDate(365),
    ...overrides
  };
}

/**
 * Generate a mock transaction
 * @param {Partial<Transaction>} [overrides]
 * @returns {Transaction}
 */
export function generateTransaction(overrides = {}) {
  const types = ['payment', 'refund', 'transfer', 'deposit', 'withdrawal'];
  const statuses = ['completed', 'pending', 'failed', 'processing'];
  const descriptions = [
    'Monthly subscription',
    'Product purchase',
    'Service fee',
    'Refund request',
    'Account credit',
    'Wire transfer'
  ];

  return {
    id: generateId(),
    type: pick(types),
    amount: Math.floor(Math.random() * 100000) / 100,
    currency: 'USD',
    status: pick(statuses),
    description: pick(descriptions),
    createdAt: randomDate(30),
    user: generateUser(),
    ...overrides
  };
}

/**
 * Generate a mock chat message
 * @param {Partial<ChatMessage>} [overrides]
 * @returns {ChatMessage}
 */
export function generateMessage(overrides = {}) {
  const contents = [
    'Hey, how are you?',
    'Did you see the latest updates?',
    'Sounds good to me!',
    'Let me check and get back to you.',
    'Thanks for letting me know.',
    'Can we discuss this tomorrow?',
    'I just sent you the files.',
    'Perfect, that works for me.',
    'Do you have a minute to chat?',
    'I appreciate your help!'
  ];

  return {
    id: generateId(),
    content: pick(contents),
    sender: generateUser(),
    timestamp: randomDate(1),
    read: Math.random() > 0.3,
    type: 'text',
    ...overrides
  };
}

/**
 * Generate a mock notification
 * @param {Partial<Notification>} [overrides]
 * @returns {Notification}
 */
export function generateNotification(overrides = {}) {
  const notifications = [
    { title: 'New message received', type: 'info' },
    { title: 'Payment processed', type: 'success' },
    { title: 'Your export is ready', type: 'success' },
    { title: 'Someone mentioned you', type: 'info' },
    { title: 'Task completed', type: 'success' },
    { title: 'Update available', type: 'warning' },
    { title: 'Action required', type: 'error' }
  ];

  const notification = pick(notifications);

  return {
    id: generateId(),
    title: notification.title,
    message: 'Click to view details',
    type: notification.type,
    read: Math.random() > 0.5,
    timestamp: randomDate(7),
    ...overrides
  };
}

/**
 * Generate a mock contact
 * @param {Partial<Contact>} [overrides]
 * @returns {Contact}
 */
export function generateContact(overrides = {}) {
  const user = generateUser();
  const phones = ['+1 555-0100', '+1 555-0199', '+44 20 7946 0958', '+49 30 901820'];

  return {
    id: user.id,
    ...user,
    phone: pick(phones),
    company: pick(['Acme Inc', 'TechCorp', 'GlobalTech', 'StartupXYZ', 'Enterprise Co']),
    title: pick(['CEO', 'CTO', 'Designer', 'Developer', 'Manager', 'Director']),
    favorite: Math.random() > 0.7,
    ...overrides
  };
}

// Bulk generators
export const generateUsers = (count) => Array.from({ length: count }, () => generateUser());
export const generateTransactions = (count) => Array.from({ length: count }, () => generateTransaction());
export const generateMessages = (count) => Array.from({ length: count }, () => generateMessage());
export const generateNotifications = (count) => Array.from({ length: count }, () => generateNotification());
export const generateContacts = (count) => Array.from({ length: count }, () => generateContact());

/**
 * Generate paginated data
 * @template T
 * @param {() => T} generator
 * @param {number} page
 * @param {number} limit
 * @param {number} total
 * @returns {T[]}
 */
export function generatePaginated(generator, page, limit, total) {
  const start = (page - 1) * limit;
  const end = Math.min(start + limit, total);
  const count = Math.max(0, end - start);
  return Array.from({ length: count }, generator);
}
