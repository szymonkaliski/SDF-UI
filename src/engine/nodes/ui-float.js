import React from 'react';

import generateNode from '../generate-node';

export default generateNode({
  spec: {
    outlet: { id: 'val', type: 'float' }
  },

  ui: ({ onUpdateMetadata }) => {
    return <div>
      <input onChange={
          (e) => { onUpdateMetadata({ val: e.target.value }) }
        }
      />
    </div>;
  },

  generate: (_, { val }) => {
    return `${val}`;
  }
});
