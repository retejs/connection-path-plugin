import * as d3 from 'd3-shape';
import Transformer from './transformers';
import Type from './types';
import { updateMarker } from './utils';

class PathFactory {

    constructor(points, curve) {
        this.points = points;
        this.curve = curve;
    }

    line(transformer) {
        let points = transformer(this.points);

        return d3.line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(this.curve)
            (points)
    }

    getData(transformer, options) {
        return this.line(transformer(options));
    }
}

function install(editor, { type, transformer, arrow, curve, options = {} }) {
    type = type || Type.DEFAULT;
    curve = curve || d3.curveBasis;

    if (transformer && typeof transformer !== 'function') throw new Error('transformer property must be a function');
    if (!Transformer[type]) throw new Error(`transformer with type ${type} doesn't exist`);
    
    editor.on('connectionpath', data => {
        const { points } = data;
        const factory = new PathFactory(points, curve);

        data.d = factory.getData(transformer || Transformer[type], options);
    });

    if (arrow) {
        editor.on('renderconnection', ({ el, connection }) => {
            const path = el.querySelector('path');
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            el.querySelector('svg').appendChild(marker);
            marker.classList.add('marker');
            marker.setAttribute('fill', arrow.color || 'steelblue');
            marker.setAttribute('d', arrow.marker || 'M-5,-10 L-5,10 L20,0 z');

            updateMarker(path, marker, { el, connection });
        });

        editor.on('updateconnection', ({ el, connection }) => {
            const path = el.querySelector('path');
            const marker = el.querySelector('.marker');

            updateMarker(path, marker, { el, connection });
        });
    }
}

export default {
    install,
    ...d3,
    ...Type
}