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

    getData(type, options) {
        return this.line(Transformer[type](options));
    }
}

function install(editor, { type = Type.DEFAULT, curve = d3.curveBasis, options = {} }) {

    editor.on('connectionpath', data => {
        const { points } = data;
        const factory = new PathFactory(points, curve);

        data.d = factory.getData(type, options);
    });
}

export default {
    install,
    ...d3,
    ...Type
}