import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3',  value: 'p'                   },
      { id: 'r', type: 'vec3',  value: 'vec3(1.0, 0.0, 0.0)' },
      { id: 'a', type: 'float', value: '0.0'                 },
      { id: 'b', type: 'float', value: '1.0'                 }
    ],
    outlet: { id: 'p', type: 'vec3' }
  },

  frag: `
vec3 opRepeatInterval(vec3 p, vec3 r, float a, float b) {
${['x', 'y', 'z'].map(key => `
  if (r.${key} > 0.0) {
    float halfr = r.${key} * 0.5;

    float c = floor((p.${key} + halfr) / r.${key});

    p.${key} = mod(p.${key} + halfr, r.${key}) - halfr;

    if (c > b) {
      p.${key} += r.${key} * (c - b);
    }
    if (c < a) {
      p.${key} += r.${key} * (c - a);
    }
  }
`).join('')}

  return p;
}
  `,

  generate: ({ p, r, a, b }) => {
    return `opRepeatInterval(
      ${p},
      ${r},
      ${a},
      ${b}
    )`;
  }
});
