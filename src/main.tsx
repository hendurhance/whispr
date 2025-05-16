import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const createAnimationStyles = () => {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes float {
      0% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(15px, -15px) rotate(10deg); }
      100% { transform: translate(0, 0) rotate(0deg); }
    }
    @keyframes messageFloat {
      0% { opacity: 0; transform: translateY(30px); }
      10% { opacity: 1; transform: translateY(0); }
      90% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-30px); }
    }
    .animation-delay-3s { animation-delay: 3s; }
    .animation-delay-6s { animation-delay: 6s; }
    .animation-delay-9s { animation-delay: 9s; }
  `;
  document.head.appendChild(styleSheet);
};

createAnimationStyles();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);