import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3', value: 'p'         },
      { id: 'r', type: 'vec3', value: 'vec3(0.0)' }
    ],
    outlet: { id: 'p', type: 'vec3' }
  },

  frag: `
vec3 opRotate(vec3 p, vec3 r) {
  float TAU = 2.0 * 3.1415;

  p.xz = cos(r.x * TAU) * p.xz + sin(r.x * TAU) * vec2(p.z, -p.x);
  p.xy = cos(r.y * TAU) * p.xy + sin(r.y * TAU) * vec2(p.y, -p.x);
  p.yz = cos(r.z * TAU) * p.yz + sin(r.z * TAU) * vec2(p.z, -p.y);

  return p;
}`,

  generate: ({ p, r }) => {
    return `opRotate(
      ${p},
      ${r}
    )`;
  }
});
