export {inspectColor, inspectNoColor, inspect} from './lib/index.js'

// To do: next major: remove.
/**
 * Deprecated, use `Options`.
 */
export type InspectOptions = Options

/**
 * Configuration.
 */
export interface Options {
  /**
   * Whether to include positional information (default: `true`).
   */
  showPositions?: boolean | null | undefined
}
