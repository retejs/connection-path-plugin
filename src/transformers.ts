import { Position, Transformer } from './types'

export const linear = (): Transformer => {
  return (points) => {
    if (points.length !== 2) throw new Error('number of points should be equal to 2')
    const [start, end] = points

    return [start, end]
  }
}

export const classic = ({ vertical = false, curvature = 0.3 }): Transformer => {
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
