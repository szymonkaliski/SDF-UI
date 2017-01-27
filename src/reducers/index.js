import { fromJS } from 'immutable';

import {
  addNode,
  moveNode,
  deleteNode,
  setNodeInletsPositions,
  updateNodeMetadata
} from './nodes';

import {
  dragEdge,
  dragEdgeDone,
  deleteEdge
} from './edges';

import {
  updateWindowSize
} from './window-size';

import {
  saveGraphDone
} from './firebase';

import {
  setCamera
} from './preview';

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

const initialState = parsed ? fromJS(parsed) : fromJS({
  nodes:      {},
  edges:      {},
  windowSize: { width: 0, height: 0 },
  camera:     { rotation: 0, height: 0, dist: 5 }
});

const actions = {
  ADD_NODE:             addNode,
  MOVE_NODE:            moveNode,
  DELETE_NODE:          deleteNode,
  SET_INLETS_POSITIONS: setNodeInletsPositions,
  UPDATE_NODE_METADATA: updateNodeMetadata,

  DRAG_EDGE:            dragEdge,
  DRAG_EDGE_DONE:       dragEdgeDone,
  DELETE_EDGE:          deleteEdge,

  UPDATE_WINDOW_SIZE:   updateWindowSize,

  SAVE_GRAPH_DONE:      saveGraphDone,

  SET_CAMERA:           setCamera
};

export default (state = initialState, action) => {
  if (actions[action.type]) {
    console.log(action);
    state = actions[action.type](state, action);
    console.log(state.toJS());
  }
  else {
    console.warn(`No handler for action ${action.type}`);
  }

  if (isDebug && state) {
    localStorage.setItem('state', JSON.stringify(state.toJS()));
  }

  return state;
};
