import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3', value: 'p'                   },
      { id: 's', type: 'vec3', value: 'vec3(1.0, 1.0, 1.0)' }
    ],
    outlet: { id: 'd', type: 'float' }
  },

  frag: `
float sdBox(vec3 p, vec3 s) {
  vec3 d = abs(p) - s;
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}`,

  generate: ({ p, s }) => {
    return `sdBox(${p}, ${s})`;
  }
});
