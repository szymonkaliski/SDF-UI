import { fromJS } from 'immutable';

export const updateWindowSize = (state, { windowSize }) => {
  return state.set('windowSize', fromJS(windowSize));
};
