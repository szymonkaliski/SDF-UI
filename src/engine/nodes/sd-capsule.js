import generateNode from '../generate-node';

export default generateNode({
  spec: {
    inlets: [
      { id: 'p', type: 'vec3',   value: 'p'                    },
      { id: 'a', type: 'vec3',   value: 'vec3(0.0, 0.0, -0.2)' },
      { id: 'b', type: 'vec3',   value: 'vec3(0.0, 0.0, 0.2)'  },
      { id: 'r', type: 'float3', value: '0.5'                  },
    ],
    outlet: { id: 'd', type: 'float' }
  },

  frag: `
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a;
  vec3 ba = b - a;

  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);

  return length(pa - ba * h) - r;
}`,

  generate: ({ p, a, b, r }) => {
    return `sdCapsule(${p}, ${a}, ${b}, ${r})`;
  }
});
