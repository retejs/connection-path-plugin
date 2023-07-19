/**
 * Built-in transformers, defining the auxiliary points for the path.
 * @module
 */

import { Position, Transformer } from './types'

/**
 * Linear transformer. Returns the same points.
 * @returns Two points
 * @throws Error if number of points is not equal to 2
 */
export const linear = (): Transformer => {
  return (points) => {
    if (points.length !== 2) throw new Error('number of points should be equal to 2')
    const [start, end] = points

    return [start, end]
  }
}

/**
 * Classic transformer. Returns four points: start, auxiliary start, auxiliary end, end.
 * @param options Options
 * @param options.vertical If true, the auxiliary points will be placed vertically. Default: `false`
 * @param options.curvature The curvature of the path. Default: `0.3`
 * @returns Four points
 */
export const classic = (options: { vertical?: boolean, curvature?: number }): Transformer => {
  const { vertical = false, curvature = 0.3 } = options

  function add(a: Position, b: Position) {
    return { x: a.x + b.x, y: a.y + b.y }
  }
  return (points) => {
    if (points.length !== 2) throw new Error('number of points should be equal to 2')

    const [start, end] = points
    const xDistance = Math.abs(start.x - end.x)
    const yDistance = Math.abs(start.y - end.y)
    const crossDistance = vertical ? xDistance : yDistance
    const alongDistance = vertical ? yDistance : xDistance
    const offset = Math.max(crossDistance / 2, alongDistance) * curvature
    const startOffset = vertical ? { x: 0, y: offset } : { y: 0, x: offset }
    const endOffset = vertical ? { x: 0, y: -offset } : { y: 0, x: -offset }

    return [start, add(start, startOffset), add(end, endOffset), end]
  }
}
