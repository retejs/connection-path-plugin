export function getAngle({ x: x1, y: y1 }, { x: x2, y: y2 }) {
    const dx = x1 - x2;
    const dy = y1 - y2;
	
    return 180 * Math.atan2(dy, dx) / Math.PI;
}

export function updateMarker(path, marker, { el, connection }) {
    const length = path.getTotalLength();
    const p1 = path.getPointAtLength(length-25);
    const p2 = path.getPointAtLength(length);

    marker.setAttribute('transform', `translate(${p1.x}, ${p1.y}) rotate(${180 + getAngle(p1, p2)})`)
}