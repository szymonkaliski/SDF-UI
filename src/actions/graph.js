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

export const dragEdge = (id, { x, y }) => ({
  type: 'DRAG_EDGE',
  fromId: id,
  x,
  y
});

export const dragEdgeDone = () => ({
  type: 'DRAG_EDGE_DONE'
});

export const setInletsPositions = (id, inletsPositions) => ({
  type: 'SET_INLETS_POSITIONS',
  id,
  inletsPositions
});

export const addNode = (nodeType, { x, y }) => ({
  type: 'ADD_NODE',
  nodeType,
  x,
  y
});

export const deleteEdge = (id) => ({
  type: 'DELETE_EDGE',
  id
});
