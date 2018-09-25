import * as d3 from 'd3-shape';
import Transformer from './transformers';
import Type from './types';

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

function install(editor, { type, transformer, curve, options = {} }) {
    type = type || Type.DEFAULT;
    curve = curve || d3.curveBasis;

    if (transformer && typeof transformer !== 'function') throw new Error('transformer property must be a function');
    if (!Transformer[type]) throw new Error(`transformer with type ${type} doesn't exist`);

    editor.on('connectionpath', data => {
        const { points } = data;
        const factory = new PathFactory(points, curve);

        data.d = factory.getData(transformer || Transformer[type], options);
    });
}

export default {
    install,
    ...d3,
    ...Type
}