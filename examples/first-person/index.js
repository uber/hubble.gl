import React from 'react';
import {render} from 'react-dom';
import App from './app';

document.body.style.backgroundColor = 'black';
render(<App />, document.body.appendChild(document.createElement('div')));
