import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'dist1', type: 'float', value: '0.0' },
      { id: 'dist2', type: 'float', value: '0.0' }
    ],
    outlet: { id: 'dist', type: 'float' }
  },

  generate: ({ dist1, dist2 }) => {
    return `min(
      ${dist1},
      ${dist2}
    )`;
  }
});
