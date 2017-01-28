import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'f', type: 'float', value: '0.0' }
    ],
    outlet: { id: 'f', type: 'float' }
  },

  generate: ({ f }) => `cos(${f})`
});
