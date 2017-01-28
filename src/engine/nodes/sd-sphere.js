import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3',  value: 'vec3(0.0)' },
      { id: 'r', type: 'float', value: '0.5'       }
    ],
    outlet: { id: 'd', type: 'float' }
  },

  frag: `
float sdSphere(vec3 p, float s) {
  return length(p) - s;
}`,

  generate: ({ p, r }) => {
    return `sdSphere(${p}, ${r})`;
  }
});
