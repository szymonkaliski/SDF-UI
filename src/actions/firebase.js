/* global firebase */

export const saveToFirebaseDone = (key) => ({
  type: 'SAVE_TO_FIREBASE_DONE',
  key
});

export const saveToFirebase = () => (dispatch, getState) => {
  const state = getState();

  // save nodes, edges and camera into db
  let data = [ 'nodes', 'edges', 'camera' ].reduce((memo, key) => {
    return {
      ...memo,
      [key]: state.get(key).toJS()
    };
  }, {});

  // save parent ID if there's one
  const parentId = state.get('databaseKey');
  if (parentId) {
    data = { ...data, parentId };
  }

  firebase
    .database()
    .ref('graphs')
    .push(data)
    .then(snap => {
      dispatch(saveToFirebaseDone(snap.key));
    });
};

export const readFromFirebaseDone = ({ data, key }) => ({
  type: 'READ_FROM_FIREBASE_DONE',
  data,
  key
});

export const readFromFirebase = (id) => (dispatch) => {
  firebase
    .database()
    .ref(`graphs/${id}`)
    .once('value')
    .then(snap => {
      dispatch(readFromFirebaseDone({
        key:  snap.key,
        data: snap.val()
      }));
    });
};

