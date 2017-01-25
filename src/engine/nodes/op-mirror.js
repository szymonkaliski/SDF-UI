import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3', value: 'p'                   },
      { id: 'm', type: 'vec3', value: 'vec3(1.0, 0.0, 0.0)' }
    ],
    outlet: { id: 'p', type: 'vec3' }
  },

  frag: `
vec3 opMirror(vec3 p, vec3 m) {
${['x', 'y', 'z'].map(key => `
  if (abs(m.${key}) > 0.0) {
    p.${key} = abs(p.${key}) - m.${key};
  }
`).join('')}

  return p;
}
  `,

  generate: ({ p, m }) => {
    return `opMirror(
      ${p},
      ${m}
    )`;
  }
});
