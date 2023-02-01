import { curveBundle, CurveFactoryLineOnly } from 'd3-shape'
import { BaseSchemes, ConnectionId, Scope } from 'rete'
import { Area2DInherited } from 'rete-area-plugin'

import { PathFactory } from './path-factory'
import * as Transformers from './transformers'
import { Position, Transformer } from './types'
import { getTransformAlong } from './utils'

export { Transformers }

type RenderProduces<Schemes extends BaseSchemes> =
    | { type: 'connectionpath', data: { payload: Schemes['Connection'], path?: string, points: Position[] } }

type Props<Schemes extends BaseSchemes> = {
    transformer?: ((connection: Schemes['Connection']) => Transformer)
    curve?: ((connection: Schemes['Connection']) => CurveFactoryLineOnly)
    arrow?: (connection: Schemes['Connection']) => boolean | { color?: string, marker?: string }
}

export class ConnectionPathPlugin<Schemes extends BaseSchemes, K> extends Scope<never, [RenderProduces<Schemes>, ...Area2DInherited<Schemes, K>]> {
    constructor(private props?: Props<Schemes>) {
        super('connection-path')
    }

    arrows = new Map<ConnectionId, any>()

    setParent(scope: Scope<RenderProduces<Schemes>, Area2DInherited<Schemes, K>>): void {
        super.setParent(scope)

        // eslint-disable-next-line max-statements
        scope.addPipe(context => {
            if (!context || typeof context !== 'object' || !('type' in context)) return context

            if (context.type === 'connectionpath') {
                const { points, payload } = context.data
                const curve = this.props?.curve ? this.props.curve(payload) : curveBundle.beta(0.9)
                const transformer = this.props?.transformer ? this.props.transformer(payload) : Transformers.classic({})
                const factory = new PathFactory(curve)
                const transformedPoints = transformer(points)

                this.updateArrow(payload)

                const path = factory.getData(transformedPoints)

                return path ? {
                    ...context,
                    data: {
                        ...context.data,
                        path
                    }
                } : context

            }
            if (context.type === 'rendered' && context.data.type === 'connection') {
                // eslint-disable-next-line max-statements
                setTimeout(() => {
                    if (!this.props?.arrow || context.data.type !== 'connection') return
                    const payload = context.data.payload
                    const id = payload.id
                    const arrowData = this.getArrowData(payload)

                    if (this.arrows.has(id) || !arrowData) return

                    const el = context.data.element
                    const path = el.querySelector('path')
                    const markerEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
                    const svg = el.querySelector('svg')

                    console.log({ el, svg, path })

                    if (!svg || !path) return context
                    svg.appendChild(markerEl)
                    markerEl.classList.add('marker')

                    this.updateArrow(payload)

                    this.arrows.set(id, { marker: markerEl, path })
                }, 50)
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
        setTimeout(() => {
            const data = this.arrows.get(c.id)
            const arrowData = this.getArrowData(c)

            if (!data || !arrowData) return

            const { color, marker } = arrowData
            data.marker.setAttribute('fill', color)
            data.marker.setAttribute('d', marker)

            data.marker.setAttribute('transform', getTransformAlong(data.path, -15))

        }, 0)
    }
}
