import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3', value: 'vec3(0.0)' },
      { id: 'a', type: 'vec3', value: 'vec3(0.0, 0.0, -0.2)' },
      { id: 'b', type: 'vec3', value: 'vec3(0.0, 0.0, 0.2)' },
      { id: 'r', type: 'float3', value: '0.5' },
    ],
    outlet: { id: 'd', type: 'float' }
  },

  generate: ({ p, a, b, r }) => {
    return `sdCapsule(${p}, ${a}, ${b}, ${r})`;
  }
});
