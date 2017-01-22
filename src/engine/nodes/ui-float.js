import React from 'react';

import generateNode from '../generate-node';

import './ui-float.css';

export default generateNode({
  spec: {
    outlet: { id: 'val', type: 'float' }
  },

  ui: ({ metadata, onUpdateMetadata }) => {
    return <div className='ui-float'>
      <input
        className='ui-float__input'
        type='number'
        step='any'
        defaultValue={ metadata.val }
        onChange={
          (e) => { onUpdateMetadata({ val: e.target.value }) }
        }
      />
    </div>;
  },

  generate: (_, { val }) => {
    return `${val}`;
  }
});
