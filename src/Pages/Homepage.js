import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Login from '../Authentication/Login';
import Signup from '../Authentication/Signup';

import './Homepage.css';
const Homepage = () => {
  
  return (
    <div className='container-fluid homecont'>
        <div className='htitle'>TextMe</div>
        <Routes>
            <Route path='/' element={<Login/>} />
            <Route path='/signup' element={<Signup />} />
        </Routes>
    </div>
  )
}

export default Homepage