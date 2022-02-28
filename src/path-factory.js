import { line } from "d3-shape";

export class PathFactory {

    constructor(points, curve) {
        this.points = points;
        this.curve = curve;
    }

    line(transformer) {
        let points = transformer(this.points);

        return line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(this.curve)
            (points)
    }

    getData(transformer, options) {
        return this.line(transformer(options));
    }
}