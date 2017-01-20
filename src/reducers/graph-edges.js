import { fromJS } from 'immutable';

import { addVec, distVec, randomId } from './utils';

export const dragEdge = (state, { fromId, x, y }) => {
  const currentDraggingEdge = state.getIn([ 'edges', 'dragging' ]);

  if (currentDraggingEdge) {
    state = state.setIn([ 'edges', 'dragging' ], fromJS({
      id: 'dragging',
      from: { id: fromId }
    }));
  }

  return state.mergeIn([ 'edges', 'dragging' ], fromJS({ x, y }));
}

export const dragEdgeDone = (state) => {
  const currentDraggingEdge = state.getIn([ 'edges', 'dragging' ]);

  if (!currentDraggingEdge) { return state; }

  // first - remove edge from state
  state = state.deleteIn([ 'edges', 'dragging' ]);

  // find nearest node
  const nearestNode = state.get('nodes').minBy(compareNode => {
    return distVec(currentDraggingEdge.toJS(), compareNode.toJS());
  });

  // find nearest inlet of nearest node
  const nearestInlet = nearestNode
    .get('inletsPositions')
    .map(inletPosition => {
      return inletPosition.merge(fromJS({
        dist: distVec(
          addVec(inletPosition.toJS(), nearestNode.toJS()),
          currentDraggingEdge.toJS()
        )
      }));
    })
    .sortBy(inlet => inlet.get('dist'))
    .first();

  const maxDist = 40;

  if (nearestInlet.get('dist') > maxDist) { return state; }

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

  return state.setIn([ 'edges', edge.get('id') ], edge);
}

export const deleteEdge = (state, { id }) => {
  return state.deleteIn([ 'edges', id ]);
}
