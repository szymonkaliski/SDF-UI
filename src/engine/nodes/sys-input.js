import generateNode from '../generate-node';

export default generateNode({
  spec: {
    outlet: { id: 'p', type: 'vec3' }
  },

  generate: () => 'p'
});
