import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3',  value: 'p'   },
      { id: 'r', type: 'float', value: '6.0' }
    ],
    outlet: { id: 'p', type: 'vec3' }
  },

  frag: `
vec3 opRepeatPolar(vec3 p, float r) {
  float angle = 2.0 * 3.1415 / r;

  float a = atan(p.y, p.x) + angle / 2.0;
  float l = length(p);

  a = mod(a, angle) - angle / 2.0;

  p.xy = vec2(cos(a), sin(a)) * l;

  return p;
}`,

  generate: ({ p, r }) => {
    return `opRepeatPolar(
      ${p},
      ${r}
    )`;
  }
});
