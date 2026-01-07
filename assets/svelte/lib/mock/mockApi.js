import { get } from 'svelte/store';
import { currentScenario, getScenarioConfig } from './scenarios.js';

/**
 * @typedef {Object} MockError
 * @property {string} code
 * @property {string} message
 * @property {Record<string, string>} [details]
 */

/**
 * @template T
 * @typedef {Object} MockResponse
 * @property {T | null} data
 * @property {MockError | null} error
 * @property {boolean} loading
 */

const errorMessages = {
  network: { code: 'NETWORK_ERROR', message: 'Network request failed. Check your connection.' },
  validation: { code: 'VALIDATION_ERROR', message: 'Invalid input data', details: {} },
  auth: { code: 'AUTH_ERROR', message: 'Session expired. Please log in again.' },
  server: { code: 'SERVER_ERROR', message: 'Something went wrong. Please try again.' }
};

/**
 * Calculate delay based on config
 * @param {number | [number, number]} delay
 * @returns {number}
 */
function calculateDelay(delay) {
  if (Array.isArray(delay)) {
    return Math.random() * (delay[1] - delay[0]) + delay[0];
  }
  return delay;
}

/**
 * Simulate async delay
 * @param {number | [number, number]} delay
 * @returns {Promise<void>}
 */
async function simulateDelay(delay) {
  const ms = calculateDelay(delay);
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if request should fail based on failure rate
 * @param {number} failureRate
 * @returns {boolean}
 */
function shouldFail(failureRate) {
  return Math.random() < failureRate;
}

/**
 * Generate mock error based on type
 * @param {string} type
 * @returns {MockError}
 */
function generateError(type) {
  return errorMessages[type] || errorMessages.server;
}

/**
 * Main mock fetch function - simulates async API call
 * @template T
 * @param {() => T} dataFn - Function that generates the data
 * @param {Object} [options] - Override options
 * @param {number | [number, number]} [options.delay]
 * @param {number} [options.failureRate]
 * @param {string} [options.errorType]
 * @returns {Promise<MockResponse<T>>}
 */
export async function mockFetch(dataFn, options = {}) {
  const scenario = get(currentScenario);
  const config = getScenarioConfig(scenario);

  const delay = options.delay ?? config.delay;
  const failureRate = options.failureRate ?? config.failureRate;
  const errorType = options.errorType ?? config.errorType ?? 'server';

  await simulateDelay(delay);

  if (shouldFail(failureRate)) {
    return {
      data: null,
      error: generateError(errorType),
      loading: false
    };
  }

  return {
    data: dataFn(),
    error: null,
    loading: false
  };
}

/**
 * Mock paginated fetch for infinite scroll
 * @template T
 * @param {(page: number, limit: number) => T[]} dataFn
 * @param {number} page
 * @param {number} limit
 * @param {number} totalItems
 * @param {Object} [options]
 * @returns {Promise<{data: T[], pagination: Object, error: MockError | null}>}
 */
export async function mockPaginatedFetch(dataFn, page, limit, totalItems, options = {}) {
  const scenario = get(currentScenario);
  const config = getScenarioConfig(scenario);

  const delay = options.delay ?? config.delay;
  const failureRate = options.failureRate ?? config.failureRate;
  const errorType = options.errorType ?? config.errorType ?? 'server';

  await simulateDelay(delay);

  if (shouldFail(failureRate)) {
    return {
      data: [],
      pagination: { page, limit, total: 0, hasMore: false },
      error: generateError(errorType)
    };
  }

  const items = dataFn(page, limit);
  return {
    data: items,
    pagination: {
      page,
      limit,
      total: totalItems,
      hasMore: page * limit < totalItems
    },
    error: null
  };
}

/**
 * Mock form submission
 * @template T
 * @param {() => T} successDataFn
 * @param {Object} [options]
 * @param {Record<string, string>} [options.validationErrors]
 * @returns {Promise<MockResponse<T>>}
 */
export async function mockSubmit(successDataFn, options = {}) {
  const scenario = get(currentScenario);
  const config = getScenarioConfig(scenario);

  await simulateDelay(config.delay);

  // Check for validation errors override
  if (options.validationErrors && Object.keys(options.validationErrors).length > 0) {
    return {
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Please fix the errors below',
        details: options.validationErrors
      },
      loading: false
    };
  }

  if (shouldFail(config.failureRate)) {
    return {
      data: null,
      error: generateError(config.errorType || 'server'),
      loading: false
    };
  }

  return {
    data: successDataFn(),
    error: null,
    loading: false
  };
}
