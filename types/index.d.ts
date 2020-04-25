// TypeScript Version: 3.0
import {Node} from 'unist'

declare namespace unistUtilInspect {
  interface UnistUtilInspectOptions {
    /**
     * Whether to include position information.
     *
     * @defaultValue true
     */
    showPositions?: boolean
  }

  /**
   * Inspect the given Node and include colors from the results
   *
   * @param node Node to inspect
   * @param options Configuration
   */
  function color(node: Node, options?: Partial<UnistUtilInspectOptions>): string

  /**
   * Inspect the given Node and exclude colors from the results
   *
   * @param node Node to inspect
   * @param options Configuration
   */
  function noColor(
    node: Node,
    options?: Partial<UnistUtilInspectOptions>
  ): string
}

/*
 * Unist utility to inspect the details of a Unist Node
 *
 * @param node Node to inspect
 * @param options Configuration
 */
declare function unistUtilInspect(
  node: Node,
  options?: Partial<unistUtilInspect.UnistUtilInspectOptions>
): string

export = unistUtilInspect
