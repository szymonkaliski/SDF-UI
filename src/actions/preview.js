export const setCamera = ({ rotation, height, dist }) => ({
  type: 'SET_CAMERA',
  rotation,
  height,
  dist
});

export const toggleFullscreen = () => ({
  type: 'TOGGLE_FULLSCREEN'
});
