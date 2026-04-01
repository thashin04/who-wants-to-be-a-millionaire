import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initSounds } from './utils/soundManager.js';

// Bootstrap sound manager (safe no-op until .mp3 files are added)
initSounds();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
