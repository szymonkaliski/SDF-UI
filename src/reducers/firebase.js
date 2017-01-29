import { fromJS } from 'immutable';

export const saveToFirebaseDone = (state, { key }) => {
  return state.set('databaseKey', key);
};

export const readFromFirebaseDone = (state, { key, data }) => {
  return [ 'nodes', 'edges', 'camera' ].reduce((memo, key) => {
    return memo.set(key, fromJS(data[key]));
  }, state).set('databaseKey', key);
};
