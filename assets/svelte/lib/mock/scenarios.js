import { writable } from 'svelte/store';

/**
 * @typedef {'happy-path' | 'slow-network' | 'intermittent-errors' | 'always-error' | 'empty-state' | 'many-items'} Scenario
 */

/**
 * @typedef {Object} ScenarioConfig
 * @property {number | [number, number]} delay - Fixed ms or [min, max] range
 * @property {number} failureRate - 0-1 probability of failure
 * @property {'network' | 'validation' | 'auth' | 'server'} [errorType]
 * @property {number} [itemCount]
 */

/** @type {Record<Scenario, ScenarioConfig>} */
export const scenarios = {
  'happy-path': {
    delay: [100, 300],
    failureRate: 0,
    itemCount: 25
  },
  'slow-network': {
    delay: [2000, 5000],
    failureRate: 0,
    itemCount: 25
  },
  'intermittent-errors': {
    delay: [200, 500],
    failureRate: 0.3,
    errorType: 'network',
    itemCount: 25
  },
  'always-error': {
    delay: [200, 400],
    failureRate: 1,
    errorType: 'server',
    itemCount: 0
  },
  'empty-state': {
    delay: [100, 200],
    failureRate: 0,
    itemCount: 0
  },
  'many-items': {
    delay: [100, 200],
    failureRate: 0,
    itemCount: 500
  }
};

/** @type {import('svelte/store').Writable<Scenario>} */
export const currentScenario = writable('happy-path');

/**
 * Get config for a scenario
 * @param {Scenario} scenario
 * @returns {ScenarioConfig}
 */
export function getScenarioConfig(scenario) {
  return scenarios[scenario] || scenarios['happy-path'];
}

/**
 * Get current scenario config reactively
 * @param {Scenario} scenario
 * @returns {ScenarioConfig}
 */
export function getCurrentConfig(scenario) {
  return getScenarioConfig(scenario);
}
