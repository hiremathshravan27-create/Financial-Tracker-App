
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
