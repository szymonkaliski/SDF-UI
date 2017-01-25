import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'd1', type: 'float', value: '0.0' },
      { id: 'd2', type: 'float', value: '0.0' }
    ],
    outlet: { id: 'd', type: 'float' }
  },

  generate: ({ d1, d2 }) => {
    return `max(
      ${d1},
      ${d2}
    )`;
  }
});
