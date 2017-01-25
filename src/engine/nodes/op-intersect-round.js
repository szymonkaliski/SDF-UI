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
float opIntersectionRound(float d1, float d2, float r) {
  vec2 u = max(vec2(r + d1, r + d2), vec2(0.0));
  return min(-r, max(d1, d2)) + length(u);
}`,

  generate: ({ d1, d2, r }) => {
    return `opIntersectionRound(
      ${d1},
      ${d2},
      ${r}
    )`;
  }
});
