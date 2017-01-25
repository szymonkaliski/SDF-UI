import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3', value: 'p'                   },
      { id: 't', type: 'vec3', value: 'vec3(0.0, 0.0, 0.0)' }
    ],
    outlet: { id: 'p', type: 'vec3' }
  },

  generate: ({ p, t }) => {
    return `${p} - ${t}`;
  }
});
