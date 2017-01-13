import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p1', type: 'float', value: '0.0' },
      { id: 'p2', type: 'float', value: '0.0' }
    ]
  },

  generate: ({ union1, union2 }) => {
    return `opUnionRound(
      ${union1},
      ${union2}
    )`;
  }
});
