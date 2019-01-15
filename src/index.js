import React from 'react';
import ReactDOM from 'react-dom';

import App from './App'
import storageUtils from './utils/storageUtils'
import MemoryUtils from './utils/MemoryUtils'

const user = storageUtils.getUser()
if (user && user._id) {
  MemoryUtils.user = user
}

ReactDOM.render(<App />, document.getElementById('root'));


