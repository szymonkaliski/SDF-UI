import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3',  value: 'p'   },
      { id: 'r', type: 'float', value: '0.5' },
      { id: 'd', type: 'float', value: '0.1' }
    ],
    outlet: { id: 'd', type: 'float' }
  },

  frag: `
float sdTorus(vec3 p, float r, float d) {
  vec2 q = vec2(length(p.xz) - r, p.y);

  return length(q) - d;
}`,

  generate: ({ p, r, d }) => {
    return `sdTorus(${p}, ${r}, ${d})`;
  }
});
