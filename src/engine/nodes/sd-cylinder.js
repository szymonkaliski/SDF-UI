import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3',  value: 'vec3(0.0)' },
      { id: 'r', type: 'float', value: '0.5'       },
      { id: 'h', type: 'float', value: '1.0'       }
    ],
    outlet: { id: 'd', type: 'float' }
  },

  frag: `
float sdCylinder(vec3 p, float r, float h) {
  vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);

  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}
`,

  generate: ({ p, r, h }) => {
    return `sdCylinder(${p}, ${r}, ${h})`;
  }
});
