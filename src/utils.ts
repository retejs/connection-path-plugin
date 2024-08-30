import { Position } from './types'

export function getAngle({ x: x1, y: y1 }: Position, { x: x2, y: y2 }: Position) {
  const dx = x1 - x2
  const dy = y1 - y2

  return 180 * Math.atan2(dy, dx) / Math.PI
}

export function getTransformAlong(path: SVGPathElement, offset: number, delta = 1, needRotate = true) {
  const length = path.getTotalLength() * delta
  const p1 = path.getPointAtLength(length + offset)
  const p2 = path.getPointAtLength(length)
  const angle = 180 + (needRotate
    ? getAngle(p1, p2)
    : 0)

  return `translate(${p1.x}, ${p1.y}) rotate(${angle})`
}
