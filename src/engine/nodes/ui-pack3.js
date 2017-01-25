import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'x', type: 'float', 'value': '0.0' },
      { id: 'y', type: 'float', 'value': '0.0' },
      { id: 'z', type: 'float', 'value': '0.0' }
    ],
    outlet: { id: 'v', type: 'vec3' }
  },

  generate: ({ f1, f2, f3 }) => {
    return `vec3(${f1}, ${f2}, ${f3})`;
  }
});
