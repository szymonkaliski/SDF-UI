import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3',  value: 'vec3(0.0)' },
      { id: 'r', type: 'float', value: '0.5'       },
      { id: 'h', type: 'float', value: '1.0'       }
    ],
    outlet: { id: 'd', type: 'float' }
  },

  frag: `
float sdHex(vec3 p, float r, float h) {
  vec3 q = abs(p);

  return max(q.z - h, max((q.x * 0.866025 + q.y * 0.5), q.y) - r);
}`,

  generate: ({ p, r, h }) => {
    return `sdHex(${p}, ${r}, ${h})`;
  }
});
