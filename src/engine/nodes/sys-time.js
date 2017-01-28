import generateNode from '../generate-node';

export default generateNode({
  spec: {
    outlet: { id: 't', type: 'float' }
  },

  generate: () => 'time'
});
