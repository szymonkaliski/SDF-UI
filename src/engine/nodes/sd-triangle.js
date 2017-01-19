import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3', value: 'vec3(0.0)' },
      { id: 'r', type: 'float', value: '0.5' },
      { id: 'd', type: 'float', value: '0.5' }
    ],
    outlet: { id: 'dist', type: 'float' }
  },

  generate: ({ p, r, d }) => {
    return `sdTriangle(${p}, ${r}, ${d})`;
  }
});
