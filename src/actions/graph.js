export const addNode = (nodeType, { x, y }) => ({
  type: 'ADD_NODE',
  nodeType,
  x,
  y
});

export const moveNode = (id, { x, y }) => ({
  type: 'MOVE_NODE',
  id,
  x,
  y
});

export const deleteNode = (id) => ({
  type: 'DELETE_NODE',
  id,
});

export const setInletsPositions = (id, inletsPositions) => ({
  type: 'SET_INLETS_POSITIONS',
  id,
  inletsPositions
});

export const updateNodeMetadata = (id, metadata) => ({
  type: 'UPDATE_NODE_METADATA',
  id,
  metadata
});

export const dragEdge = (id, { x, y }, outlet) => ({
  type: 'DRAG_EDGE',
  fromId: id,
  x,
  y,
  outlet
});

export const dragEdgeDone = () => ({
  type: 'DRAG_EDGE_DONE'
});

export const deleteEdge = (id) => ({
  type: 'DELETE_EDGE',
  id
});
