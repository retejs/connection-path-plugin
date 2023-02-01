import { ReteOptions } from 'rete-cli'

export default <ReteOptions>{
    input: 'src/index.ts',
    name: 'ConnectionPathPlugin',
    globals: {
        'rete': 'Rete',
        'rete-area-plugin': 'ReteAreaPlugin',
        'rete-render-utils': 'RenderUtils',
        'd3-shape': 'd3'
    }
}
