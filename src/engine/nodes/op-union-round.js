import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'd1', type: 'float', value: '0.0' },
      { id: 'd2', type: 'float', value: '0.0' },
      { id: 'r',  type: 'float', value: '0.5' }
    ],
    outlet: { id: 'd', type: 'float' }
  },

  frag: `
float opUnionRound(float dist1, float dist2, float r) {
  vec2 u = max(vec2(r - dist1, r - dist2), vec2(0.0));
  return max(r, min(dist1, dist2)) - length(u);
}
  `,

  generate: ({ d1, d2, r }) => {
    return `opUnionRound(
      ${d1},
      ${d2},
      ${r}
    )`;
  }
});
