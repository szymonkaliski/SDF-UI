import { fromJS } from 'immutable';
import { randomId } from './utils';

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
  setCamera,
  toggleFullscreen
} from './preview';

import {
  saveToFirebaseDone,
  readFromFirebaseDone
} from './firebase';

import compileGraph from '../engine/compile-graph';
import generateSDFFragment from '../engine/generate-sdf-fragment';

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

const generateInitialState = () => {
  const sysInputId  = randomId();
  const sysOutputId = randomId();
  const sdSphereId     = randomId();
  const edge1Id     = randomId();
  const edge2Id     = randomId();

  const nodes = {
    [sysInputId]:  { id: sysInputId,  x: 100, y: 100, type: "sysInput"  },
    [sysOutputId]: { id: sysOutputId, x: 100, y: 500, type: "sysOutput" },
    [sdSphereId]:  { id: sdSphereId,  x: 100, y: 300, type: "sdSphere"  },
  };

  const edges = {
    [edge1Id]: { id: edge1Id, from: { id: sysInputId }, to: { id: sdSphereId,  inlet: 'p' } },
    [edge2Id]: { id: edge2Id, from: { id: sdSphereId }, to: { id: sysOutputId, inlet: 'd' } },
  };

  return {
    nodes,
    edges,
    windowSize:  { width: 0, height: 0 },
    camera:      { rotation: 0, height: 0, dist: 5 },
    databaseKey: undefined,
    fragment:    undefined,
    fullscreen:  false
  };
};

const initialState = fromJS(parsed || generateInitialState());

const actions = {
  ADD_NODE:                addNode,
  MOVE_NODE:               moveNode,
  DELETE_NODE:             deleteNode,
  SET_INLETS_POSITIONS:    setNodeInletsPositions,
  UPDATE_NODE_METADATA:    updateNodeMetadata,

  DRAG_EDGE:               dragEdge,
  DRAG_EDGE_DONE:          dragEdgeDone,
  DELETE_EDGE:             deleteEdge,

  SET_CAMERA:              setCamera,
  TOGGLE_FULLSCREEN:       toggleFullscreen,

  UPDATE_WINDOW_SIZE:      updateWindowSize,

  SAVE_TO_FIREBASE_DONE:   saveToFirebaseDone,
  READ_FROM_FIREBASE_DONE: readFromFirebaseDone
};

export default (state = initialState, action) => {
  if (actions[action.type]) {
    state = actions[action.type](state, action);
  }
  else {
    console.warn(`No handler for action ${action.type}`);
  }

  const compiled = compileGraph({
    nodes: state.get('nodes'),
    edges: state.get('edges')
  });

  state = state.set('fragment', compiled ? generateSDFFragment(compiled) : undefined);

  if (isDebug && state) {
    localStorage.setItem('state', JSON.stringify(state.toJS()));
  }

  return state;
};
