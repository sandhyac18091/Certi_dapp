import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IssueCertificate from './Pages/Issue';  
import Home from './Pages/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issue" element={<IssueCertificate />} />
      </Routes>
    </Router>
  );
};

export default App;
