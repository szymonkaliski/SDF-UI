import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3', value: 'vec3(0.0)' },
      { id: 's', type: 'vec3', value: 'vec3(1.0, 1.0, 1.0)' }
    ],
    outlet: { id: 'd', type: 'float' }
  },

  generate: ({ p, s }) => {
    return `sdBox(${p}, ${s})`;
  }
});
