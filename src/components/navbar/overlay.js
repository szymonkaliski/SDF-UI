import React from 'react';

import './overlay.css';

export default ({ content, onClickClose }) => {
  return <div className='overlay__wrapper'>
    <div className='overlay__close' onClick={ onClickClose }>
      CLOSE
    </div>
    <div className='overlay'>
      { content }
    </div>
  </div>;
};

