import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import CanvasModel from './canvas/CanvasModel'
import state from './store'
import { useSnapshot } from 'valtio'
import Machine from './pages/Machine/Machine'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Machine />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
      </Routes>
    </BrowserRouter>


  )
}

export default App
