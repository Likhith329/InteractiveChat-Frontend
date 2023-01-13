
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Allchats from '../Components/Allchats'
import Chat from '../Components/Chat'
import Navbar from '../Components/Navbar';
import './Chatspage.css';

const Chatspage = () => {
  const user=  JSON.parse(localStorage.getItem('userInfo'))
  const navigate=useNavigate()
  
  useEffect(()=>{
    if(!user)navigate('/')
  },[])
  const [notification,setNotification]=useState([])

  return (
    <div>
      {user?
      <div>
        <Navbar />
      <div className='chatspagecont'>
        <Allchats   />
        <Chat  notification={notification} setNotification={setNotification} />
    </div>
      </div>:navigate('/')}
    </div>
  )
}

export default Chatspage