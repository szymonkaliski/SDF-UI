import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'dist', type: 'float', value: '0.0' }
    ]
  },

  generate: ({ dist }) => {
    return `${dist}`;
  }
});
