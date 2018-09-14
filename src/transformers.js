export default {
    LINEAR: () => ([x1, y1, x2, y2]) => {
        return [[x1, y1], [x2, y2]];
    },
    DEFAULT: ({ vertical = false, curvature = 0.4 }) => ([x1, y1, x2, y2]) => {
        const p1 = [x1, y1];
        const p4 = [x2, y2];

        if (vertical) {
            [x1, y1] = [y1, x1];
            [x2, y2] = [y2, x2];
        }

        const c1 = x1 + Math.abs(x2 - x1) * curvature;
        const c2 = x2 - Math.abs(x2 - x1) * curvature;
        const p2 = vertical ? [y1, c1] : [c1, y1];
        const p3 = vertical ? [y2, c2] : [c2, y2];

        return [p1, p2, p3, p4];
    }
}