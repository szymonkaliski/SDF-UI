import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3', value: 'p'                   },
      { id: 'r', type: 'vec3', value: 'vec3(1.0, 0.0, 0.0)' }
    ],
    outlet: { id: 'p', type: 'vec3' }
  },

  frag: `
vec3 opRepeat(vec3 p, vec3 r) {
${['x', 'y', 'z'].map(key => `
  if (r.${key} > 0.0) {
    float halfr = r.${key} * 0.5;
    p.${key} = mod(p.${key} + halfr, r.${key}) - halfr;
  }
`).join('')}

  return p;
}
  `,

  generate: ({ p, r }) => {
    return `opRepeat(
      ${p},
      ${r}
    )`;
  }
});
