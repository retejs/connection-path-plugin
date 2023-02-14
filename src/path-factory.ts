import { CurveFactoryLineOnly, line } from 'd3-shape'

import { Position } from './types'

export class PathFactory {
  constructor(private curve: CurveFactoryLineOnly) {}

  getData(points: Position[]) {
    const getPath = line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(this.curve)

    return getPath(points.map(p => ([p.x, p.y])))
  }
}
