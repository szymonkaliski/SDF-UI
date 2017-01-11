export const moveNode = (id, { x, y }) => ({
  type: 'MOVE_NODE',
  id,
  x,
  y
});
