const initialState = {
  nodes: {
    n001: { id: 'n001', x: 80,  y: 150, type: 'opUnionRound' },
    n002: { id: 'n002', x: 350, y: 280, type: 'sdSphere'     },
  },
  edges: {
  }
};

export default (state = initialState, action) => {
  return state;
};
