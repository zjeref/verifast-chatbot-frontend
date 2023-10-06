import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ChatbotLogic from './ChatbotLogic';

function App() {
  return (
    <Router basename="">
      <div className="App">
        <Routes>
          <Route path="/chatbot" element={<ChatbotLogic />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
