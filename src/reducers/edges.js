import get from 'lodash.get';
import { fromJS } from 'immutable';

import { addVec, distVec, randomId } from './utils';
import nodeSpecs from '../engine/nodes';

export const dragEdge = (state, { fromId, x, y, outlet }) => {
  const currentDraggingEdge = state.getIn([ 'edges', 'dragging' ]);

  if (currentDraggingEdge) {
    state = state.setIn([ 'edges', 'dragging' ], fromJS({
      id: 'dragging',
      from: { id: fromId, type: outlet.type }
    }));
  }

  return state.mergeIn([ 'edges', 'dragging' ], fromJS({ x, y }));
};

export const dragEdgeDone = (state) => {
  const currentDraggingEdge = state.getIn([ 'edges', 'dragging' ]);

  // first - remove edge from state
  state = state.deleteIn([ 'edges', 'dragging' ]);

  // find nearest node
  const nearestNode = state.get('nodes').minBy(compareNode => {
    return distVec(currentDraggingEdge.toJS(), compareNode.toJS());
  });

  // only connect if nearest node has any inlets
  if (!nearestNode.has('inletsPositions')) { return state; }

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

  // only connect if types match
  const inletSpec = get(nodeSpecs, [nearestNode.get('type'), 'spec', 'inlets' ], [])
    .find(({ id }) => id === nearestInlet.get('id'));

  const inletType  = get(inletSpec, 'type');
  const outletType = currentDraggingEdge.getIn([ 'from', 'type' ]);

  if (inletType !== outletType) { return state; }

  // only connect if close enough to the inlet
  const maxDist = 40;

  if (nearestInlet.get('dist') > maxDist) { return state; }

  // only connect if there's no previous connections to given inlet
  const alreadyExist = state.get('edges').find(edge => {
    return edge.getIn([ 'to', 'id'    ]) === nearestNode.get('id') &&
           edge.getIn([ 'to', 'inlet' ]) === nearestInlet.get('id');
  });

  if (alreadyExist) { return state; }

  // otherwise make new connection in state
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
};

export const deleteEdge = (state, { id }) => {
  return state.deleteIn([ 'edges', id ]);
};
