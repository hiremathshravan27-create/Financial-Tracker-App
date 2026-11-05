import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load your pages
const Dashboard = lazy(() => import('./pages/Dashboard')); // Update path to match your actual pages
const Transactions = lazy(() => import('./pages/Transactions'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;