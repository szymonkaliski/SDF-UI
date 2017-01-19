import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3', value: 'vec3(0.0)' },
      { id: 'c', type: 'vec3', value: 'vec3(1.0, 0.5, 1.0)' }
    ],
    outlet: { id: 'dist', type: 'float' }
  },

  generate: ({ p, c }) => {
    return `sdCone(${p}, ${c})`;
  }
});
