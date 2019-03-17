import * as d3 from 'd3-shape';
import { PathFactory } from './path-factory';
import Transformer from './transformers';
import Type from './types';
import { getTransformAlong } from './utils';

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
        editor.on('renderconnection', ({ el }) => {
            const path = el.querySelector('path');
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            el.querySelector('svg').appendChild(marker);
            marker.classList.add('marker');
            marker.setAttribute('fill', arrow.color || 'steelblue');
            marker.setAttribute('d', arrow.marker || 'M-5,-10 L-5,10 L20,0 z');

            marker.setAttribute('transform', getTransformAlong(path, -25));
        });

        editor.on('updateconnection', ({ el }) => {
            const path = el.querySelector('path');
            const marker = el.querySelector('.marker');

            marker.setAttribute('transform', getTransformAlong(path, -25));
        });
    }
}
export { getTransformAlong } from './utils';

export default {
    install,
    ...d3,
    ...Type
}