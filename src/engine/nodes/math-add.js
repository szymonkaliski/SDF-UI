import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'a', type: 'float', value: '1.0' },
      { id: 'b', type: 'float', value: '1.0' }
    ],
    outlet: { id: 'f', type: 'float' }
  },

  generate: ({ a, b }) => `((${a}) + (${b}))`
});
