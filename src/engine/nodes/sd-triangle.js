import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3',  value: 'vec3(0.0)' },
      { id: 'r', type: 'float', value: '0.5'       },
      { id: 'd', type: 'float', value: '0.5'       }
    ],
    outlet: { id: 'd', type: 'float' }
  },

  frag: `
float sdTriangle(vec3 p, float r, float d) {
  vec3 q = abs(p);
  return max(q.z - d, max(q.x * 0.866025 + p.y * 0.5, -p.y) - r * 0.5);
}`,

  generate: ({ p, r, d }) => {
    return `sdTriangle(${p}, ${r}, ${d})`;
  }
});
