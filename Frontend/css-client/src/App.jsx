import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'; // Estilos
import AppRoutes from './routes/AppRoutes';
import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
