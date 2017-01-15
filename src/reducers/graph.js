import { fromJS } from 'immutable';

const initialState = fromJS({
  nodes: {
    n001: { id: 'n001', x: 80,  y: 580, type: 'opUnionRound' },
    n002: { id: 'n002', x: 350, y: 180, type: 'sdSphere'     },
    n003: { id: 'n003', x: 100, y: 230, type: 'sdSphere'     }
  },
  edges: {}
});

const distVec = (a, b) => {
  const xd = a.get('x') - b.get('x');
  const yd = a.get('y') - b.get('y');

  return Math.sqrt(xd * xd + yd * yd);
};

const addVec = (a, b) => {
  return fromJS({
    x: a.get('x') + b.get('x'),
    y: a.get('y') + b.get('y')
  });
};

const randomId = () => `${(new Date()).getTime()}`;

export default (state = initialState, action) => {
  if (action.type === 'MOVE_NODE') {
    const { id, x, y } = action;

    state = state.mergeIn([ 'nodes', id ], fromJS({ x, y }));
  }

  if (action.type === 'DRAG_EDGE') {
    const { fromId, x, y } = action;

    const currentDraggingEdge = state.getIn([ 'edges', 'dragging' ]);

    if (currentDraggingEdge) {
      state = state.setIn([ 'edges', 'dragging' ], fromJS({
        id: 'dragging',
        from: { id: fromId }
      }));
    }

    state = state.mergeIn([ 'edges', 'dragging' ], fromJS({ x, y }));
  }

  if (action.type === 'DRAG_EDGE_DONE') {
    const currentDraggingEdge = state.getIn([ 'edges', 'dragging' ]);

    if (currentDraggingEdge) {
      // first - remove edge from state
      state = state.deleteIn([ 'edges', 'dragging' ]);

      // find nearest node
      const nearestNode = state.get('nodes').minBy(compareNode => {
        return distVec(currentDraggingEdge, compareNode);
      });

      // find nearest inlet of nearest node
      const nearestInlet = nearestNode
        .get('inletsPositions')
        .map(inletPosition => {
          return inletPosition.merge(fromJS({
            dist: distVec(
              addVec(inletPosition, nearestNode),
              currentDraggingEdge
            )
          }));
        })
        .sortBy(inlet => inlet.get('dist'))
        .first();

      const maxDist = 20;

      if (nearestInlet.get('dist') < maxDist) {
        const edge = fromJS({
          id: randomId(),
          from: {
            id: currentDraggingEdge.getIn([ 'from', 'id' ])
          },
          to: {
            id: nearestNode.get('id'),
            inlet: nearestInlet.get('id')
          }
        });

        state = state.setIn([ 'edges', edge.get('id') ], edge);
      }
    }
  }

  if (action.type === 'SET_INLETS_POSITIONS') {
    const { id, inletsPositions } = action;

    const inletsWithIds = Object.keys(inletsPositions).reduce((memo, key) => ({
      ...memo,
      [key]: {
        ...inletsPositions[key],
        id: key
      }
    }), {});

    state = state.mergeIn([ 'nodes', id, 'inletsPositions' ], fromJS(inletsWithIds));
  }

  return state;
};
