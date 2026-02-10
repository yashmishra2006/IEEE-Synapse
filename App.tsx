import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import LaunchScreen from './components/LaunchScreen';
import EventsPage from './components/EventsPage';

const GlobalLoginTrigger: React.FC = () => {
  const { handleLoginSuccess } = useAuth();
  return (
    <div id="global-login-trigger" className="hidden pointer-events-none opacity-0 scale-0 fixed overflow-hidden">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.log('Login Failed')}
        theme="outline"
        shape="circle"
        type="icon"
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GlobalLoginTrigger />
      <HashRouter>
        <Routes>
          <Route path="/" element={<LaunchScreen />} />
          <Route path="/events" element={<EventsPage />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;