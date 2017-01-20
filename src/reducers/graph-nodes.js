import { fromJS } from 'immutable';

import { randomId } from './utils';

export const addNode = (state, { nodeType, x, y }) => {
  const id = randomId();

  return state.setIn([ 'nodes', id ], fromJS({ id, x, y, type: nodeType }));
}

export const moveNode = (state, { id, x, y }) => {
  return state.mergeIn([ 'nodes', id ], fromJS({ x, y }));
}

export const setNodeInletsPositions = (state, { id, inletsPositions }) => {
  const inletsWithIds = Object.keys(inletsPositions).reduce((memo, key) => ({
    ...memo,
    [key]: {
      ...inletsPositions[key],
      id: key
    }
  }), {});

  return state.mergeIn([ 'nodes', id, 'inletsPositions' ], fromJS(inletsWithIds));
}

export const deleteNode = (state, { id }) => {
  console.log(id);

  return state
    .deleteIn([ 'nodes', id ])
    .set('edges', state.get('edges').filter((edge) => {
      return edge.getIn([ 'from', 'id' ]) !== id
          && edge.getIn([ 'to',   'id' ]) !== id;
    }));
}
