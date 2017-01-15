export const moveNode = (id, { x, y }) => ({
  type: 'MOVE_NODE',
  id,
  x,
  y
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
