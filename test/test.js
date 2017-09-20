import TestLayout from './TestLayout';
import * as React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener("DOMContentLoaded", function() {
  var contentDiv = document.getElementById('content');
  ReactDOM.render(React.createElement(TestLayout), contentDiv);
});
