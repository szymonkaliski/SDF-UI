import { fromJS } from 'immutable';

import {
  addNode,
  moveNode,
  setNodeInletsPositions,
  deleteNode
} from './nodes';

import {
  dragEdge,
  dragEdgeDone,
  deleteEdge
} from './edges';

const isDebug = window.location.search.indexOf('debug') >= 0;

let parsed;

if (isDebug) {
  try {
    parsed = JSON.parse(localStorage.getItem('state'));
  }
  catch (e) {
    console.error(e);
  }

  window.clearGraph = () => {
    localStorage.setItem('state', null);
    window.location.reload();
  }
}

const initialState = parsed ? fromJS(parsed) : fromJS({ nodes: {}, edges: {} });

const actions = {
  ADD_NODE:             addNode,
  MOVE_NODE:            moveNode,
  SET_INLETS_POSITIONS: setNodeInletsPositions,
  DELETE_NODE:          deleteNode,

  DRAG_EDGE:            dragEdge,
  DRAG_EDGE_DONE:       dragEdgeDone,
  DELETE_EDGE:          deleteEdge
};

export default (state = initialState, action) => {
  if (actions[action.type]) {
    state = actions[action.type](state, action);
  }

  if (isDebug && state) {
    localStorage.setItem('state', JSON.stringify(state.toJS()));
  }

  return state;
};
