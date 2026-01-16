import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LaunchScreen from './components/LaunchScreen';
import IdeScreen from './components/IdeScreen';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LaunchScreen />} />
        <Route path="/ide" element={<IdeScreen />} />
      </Routes>
    </HashRouter>
  );
};

export default App;