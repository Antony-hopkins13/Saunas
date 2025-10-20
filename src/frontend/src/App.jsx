import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Sauna from './pages/Sauna'
import Booking from './pages/Booking'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <h1>🔥 Сауна-Букер</h1>
          <p>Бронирование саун и бань</p>
        </header>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sauna/:id" element={<Sauna />} />
          <Route path="/booking/:id" element={<Booking />} />
        </Routes>
        
        <footer className="footer">
          <p>&copy; 2024 Сауна-Букер. Все права защищены.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
