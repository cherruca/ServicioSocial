import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RecoilRoot } from 'recoil';
import { AuthProvider } from './states/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
      <AuthProvider> 
        <App />
      </AuthProvider>
    </RecoilRoot>
  </StrictMode>
);
