import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3', value: 'vec3(0.0)' },
      { id: 'pos', type: 'vec3', value: 'vec3(0.0)' },
      { id: 'r', type: 'float', value: '1.0' }
    ]
  },

  generate: ({ p, pos, r }) => {
    return `sdSphere(${p}, ${pos}, ${r})`;
  }
});
