import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'dist1', type: 'float', value: '0.0' },
      { id: 'dist2', type: 'float', value: '0.0' }
    ],
    outlet: { id: 'dist', type: 'float' }
  },

  generate: ({ union1, union2 }) => {
    return `opUnionRound(
      ${union1},
      ${union2}
    )`;
  }
});
