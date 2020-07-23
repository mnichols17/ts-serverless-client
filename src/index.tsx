import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import {SearchProvider} from './utils/context';

ReactDOM.render(<SearchProvider><App /></SearchProvider>, document.getElementById('root'));