/* global firebase */

export const saveToFirebaseDone = (key) => ({
  type: 'SAVE_TO_FIREBASE_DONE',
  key
});

export const saveToFirebase = () => (dispatch, getState) => {
  const state = getState();

  const data = [ 'nodes', 'edges', 'camera' ].reduce((memo, key) => {
    return {
      ...memo,
      [key]: state.get(key).toJS()
    };
  }, {});

  firebase
    .database()
    .ref('graphs')
    .push(data)
    .then(snap => {
      dispatch(saveToFirebaseDone(snap.key));
    });
};

export const readFromFirebaseDone = (data) => ({
  type: 'READ_FROM_FIREBASE_DONE',
  data
});

export const readFromFirebase = (id) => (dispatch) => {
  firebase
    .database()
    .ref(`graphs/${id}`)
    .once('value')
    .then(snap => {
      dispatch(readFromFirebaseDone(snap.val()));
    });
};

