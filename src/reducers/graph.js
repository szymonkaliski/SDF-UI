import { fromJS, Map } from 'immutable';

const initialState = fromJS({
  nodes: {
    n001: { id: 'n001', x: 80,  y: 580, type: 'opUnionRound' },
    n002: { id: 'n002', x: 350, y: 180, type: 'sdSphere'     },
    n003: { id: 'n003', x: 100, y: 230, type: 'sdSphere'     }
  },
  edges: {
    e001: {
      id: 'e001',
      from: { id: 'n002' },
      to: { id: 'n001', inlet: 'p1' }
    },
    e002: {
      id: 'e002',
      from: { id: 'n003' },
      to: { id: 'n001', inlet: 'p2' }
    }
  }
});

export default (state = initialState, action) => {
  if (action.type === 'MOVE_NODE') {
    const { id, x, y } = action;

    state = state.mergeIn([ 'nodes', id ], Map({ x, y }));
  }

  return state;
};
