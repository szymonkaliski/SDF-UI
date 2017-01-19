import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3', value: 'vec3(0.0)' },
      { id: 'size', type: 'vec3', value: 'vec3(0.5, 0.5, 0.5)' }
    ],
    outlet: { id: 'dist', type: 'float' }
  },

  generate: ({ p, size }) => {
    return `sdBox(${p}, ${size})`;
  }
});
