import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'd', type: 'float', value: '0.0' }
    ]
  },

  generate: ({ d }) => {
    return `${d}`;
  }
});
