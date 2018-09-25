Connection Path
====
#### Rete.js plugin

```js
import ConnectionPathPlugin from 'rete-connection-path-plugin';

editor.use(ConnectionPathPlugin, {
    type: ConnectionPathPlugin.DEFAULT, // DEFAULT or LINEAR transformer
    transformer: () => ([x1, y1, x2, y2]) => [[x1, y1], [x2, y2]], // optional, custom transformer
    curve: ConnectionPathPlugin.curveBundle, // curve identifier
    options: { vertical: false, curvature: 0.4 }, // optional
    arrow: { color: 'steelblue', marker: 'M-5,-10 L-5,10 L20,0 z' }
});
```

| Property | Description | Optional | 
|---|---|---|
| type | Type of built-in transformer | + |
| transformer | Custom transformer | + |
| curve | any [curve from d3-shape](https://github.com/d3/d3-shape#curves) | + |
| options | `{ vertical: Boolean, curvature: Number }` | + |
| arrow | `Boolean` or `{ color,  marker: /* path d attribute */ }` | + |