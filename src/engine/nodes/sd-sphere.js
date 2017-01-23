import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3', value: 'vec3(0.0)' },
      { id: 'r', type: 'float', value: '0.66' }
    ],
    outlet: { id: 'd', type: 'float' }
  },

  generate: ({ p, r }) => {
    return `sdSphere(${p}, ${r})`;
  }
});
