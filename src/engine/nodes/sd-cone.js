import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3', value: 'p'                   },
      { id: 's', type: 'vec3', value: 'vec3(1.0, 0.5, 1.0)' }
    ],
    outlet: { id: 'd', type: 'float' }
  },

  frag: `
float sdCone(vec3 p, vec3 s) {
  vec2 q = vec2(length(p.xz), p.y);
  float d1 = -p.y - s.z;
  float d2 = max(dot(q, s.xy), p.y);

  return length(max(vec2(d1, d2), 0.0)) + min(max(d1, d2), 0.);
}`,

  generate: ({ p, s }) => {
    return `sdCone(${p}, ${s})`;
  }
});
