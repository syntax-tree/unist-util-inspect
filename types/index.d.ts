// Type definitions for unist-util-inspect 4.1
// Project: https://github.com/syntax-tree/unist-util-inspect/#readme
// Definitions by: Shane Handley <https://github.com/shanehandley>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0
import { Node } from 'unist';

export = inpect;

/*
 * Unist utility to inspect the details of a Unist Node
 *
 * @param node Node to inspect
 */
declare function inpect(node: Node): string;

declare namespace inpect {
  /**
   * Inspect the given Node and include colors from the results
   *
   * @param node Node to inspect
   */
  function color(node: Node): string;

  /**
   * Inspect the given Node and exclude colors from the results
   *
   * @param node Node to inspect
   */
  function noColor(node: Node): string;
}