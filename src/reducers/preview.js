import { fromJS } from 'immutable';

const removeEmptyVals = (obj) => {
  return Object.keys(obj).reduce((memo, key) => {
    const val = obj[key];

    return {
      ...memo,
      ...val !== undefined && { [key]: val}
    };
  }, {});
};

export const setCamera = (state, { rotation, height, dist }) => {
  const camera = removeEmptyVals({ rotation, height, dist });
  console.log(camera)
  return state.mergeIn([ 'camera' ], fromJS(camera));
};
