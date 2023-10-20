import { curveBundle, CurveFactoryLineOnly } from 'd3-shape'
import { BaseSchemes, ConnectionId, Scope } from 'rete'
import { Area2DInherited } from 'rete-area-plugin'
import { classicConnectionPath } from 'rete-render-utils'

import { PathFactory } from './path-factory'
import * as Transformers from './transformers'
import { Position, Transformer } from './types'
import { getTransformAlong } from './utils'

export { Transformers }

type RenderProduces<Schemes extends BaseSchemes> =
  | { type: 'connectionpath', data: { payload: Schemes['Connection'], path?: string, points: Position[] } }

/**
 * Connection path plugin props
 */
export type Props<Schemes extends BaseSchemes> = {
  /** The transformer function that defines auxiliary points for the path. Default: `Transformers.classic({})` */
  transformer?: ((connection: Schemes['Connection']) => Transformer)
  /** The curve factory function that defines the shape of the path. Default: `curveBundle.beta(0.9)` */
  curve?: ((connection: Schemes['Connection']) => CurveFactoryLineOnly)
  /** Customize/enable arrow. Allows to change arrow color (default: `steelblue`) and marker (default: `M-5,-10 L-5,10 L20,0 z)` */
  arrow?: (connection: Schemes['Connection']) => boolean | { color?: string, marker?: string }
}

/**
 * Connection path plugin. Allows to customize connection path and arrow.
 * @listens connectionpath
 * @listens rendered
 */
export class ConnectionPathPlugin<Schemes extends BaseSchemes, K> extends Scope<never, [RenderProduces<Schemes>, ...Area2DInherited<Schemes, K>]> {
  /**
   * @constructor
   * @param props Connection path plugin props
   */
  constructor(private props?: Props<Schemes>) {
    super('connection-path')
  }

  arrows = new Map<ConnectionId, { marker: SVGPathElement }>()
  transforms = new Map<ConnectionId, string>()

  setParent(scope: Scope<RenderProduces<Schemes>, Area2DInherited<Schemes, K>>): void {
    super.setParent(scope)

    // eslint-disable-next-line max-statements,complexity
    scope.addPipe(context => {
      if (!context || typeof context !== 'object' || !('type' in context)) return context

      if (context.type === 'connectionpath') {
        const { points, payload } = context.data
        const curve = this.props?.curve ? this.props.curve(payload) : curveBundle.beta(0.9)
        const transformer = this.props?.transformer ? this.props.transformer(payload) : Transformers.classic({})
        const factory = new PathFactory(curve)
        const transformedPoints = transformer(points)
        const path = factory.getData(transformedPoints)

        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path')

        p.setAttribute('d', path || classicConnectionPath(transformedPoints as [Position, Position], 0.3))

        this.transforms.set(payload.id, getTransformAlong(p, -15))
        this.updateArrow(payload)

        return path ? {
          ...context,
          data: {
            ...context.data,
            path
          }
        } : context
      }
      if (context.type === 'connectionremoved') {
        const { id } = context.data

        this.arrows.delete(id)
        this.transforms.delete(id)
      }
      if (context.type === 'rendered' && context.data.type === 'connection') {
        if (!this.props?.arrow || context.data.type !== 'connection') return
        const payload = context.data.payload
        const id = payload.id
        const arrowData = this.getArrowData(payload)

        if (this.arrows.has(id) || !arrowData) return

        const el = context.data.element
        const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'path')

        svgEl.setAttribute('style', 'position: absolute; overflow: visible !important; pointer-events: none')
        svgEl.appendChild(marker)
        el.appendChild(svgEl)

        marker.classList.add('marker')

        this.arrows.set(id, { marker })
        this.updateArrow(payload)
      }

      return context
    })
  }

  private getArrowData(c: Schemes['Connection']) {
    if (!this.props?.arrow) return null
    const data = this.props.arrow(c)

    if (!data) return null
    const { color = 'steelblue', marker = 'M-5,-10 L-5,10 L20,0 z' } = data === true ? {} : data

    return { color, marker }
  }

  private updateArrow(c: Schemes['Connection']) {
    const data = this.arrows.get(c.id)
    const arrowData = this.getArrowData(c)

    if (!data || !arrowData) return

    const { color, marker } = arrowData

    data.marker.setAttribute('fill', color)
    data.marker.setAttribute('d', marker)

    data.marker.setAttribute('transform', this.transforms.get(c.id) || '')
  }
}
