import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/Chatprovider';
import './Allchats.css';
import ChatComponent from './ChatComponent';
import Groupcomponent from './Groupcomponent';
import Notification from './Notification';
import UsersComponent from './UsersComponent';

const Allchats = () => {

  const {selectedchat ,render,notification,setNotification}=ChatState()
    
  const [chats,setChats]=useState([])
  
  const [search,setSearch]=useState('')
  const [results,setResults]=useState('')
  const user=JSON.parse(localStorage.getItem('userInfo'))
  const token=user.token

    async function getsearchedData(search){
      try {
        await axios.get('https://interactivechat-backend.onrender.com/register/signup?search='+search,{
        headers:{
            "access-token":token
        }
    }).then(response=>setResults(response.data))
      } catch (error) {
        console.log(error)
      }
    }
  
    async function getallchats(){
      try {
        await axios.get('https://interactivechat-backend.onrender.com/chats',{
        headers:{
            "access-token":token
        }
      }).then(response=>setChats(response.data))
        } catch (error) {
          console.log(error)
        }
    }

    useEffect(()=>{
      getallchats()
    },[render])

  const [disp,setDisp]=useState('')
  const [showcross,setShowcross]=useState('none')

  const styles1={
    display:disp
  }
  const styles2={
    display:disp==''?'none':''
  }
  const styles3={
    display:showcross
  }
  const styles4={
    display:showcross==''?'none':''
  }

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const setWindowDimensions = () => {
    setWindowWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', setWindowDimensions);
    return () => {
      window.removeEventListener('resize', setWindowDimensions)
    }
  }, [])

  return (
    <div>
    {windowWidth<750 && selectedchat?'':
      <div className='allchatscont' >

      <div className='search'>
         <button className='searchbtn' style={styles4}><i className="bi bi-search" ></i></button>
         <button className='searchbtn'  style={styles3}><i className="bi bi-arrow-left" onClick={()=>{
          setSearch('')
          setDisp('')
          setShowcross('none')
          }}></i></button>
        <input className='searchbar' value={search} type={'text'} placeholder='Search or start new chat' onChange={(e)=>{
          let val=e.target.value.trim()
          setSearch(val)
          if(val==''){
            setDisp('')
            setShowcross('none')
          }
          else{
            setDisp('none')
            getsearchedData(val)
          }
        }} 
        onFocus={()=>{
          setShowcross('')
        }}
        ></input>
        <i className="bi bi-people"  data-bs-toggle="offcanvas" data-bs-target="#groupcomponent" aria-controls="groupcomponent"></i>
        <span data-bs-toggle="offcanvas" data-bs-target="#notifcomponent" aria-controls="notifcomponent"><i className="bi bi-bell-fill"></i><span className='badge'  >{notification?.length!=0?notification.length:''}</span></span>
      </div>

      <div className='searchedChats' style={styles2}>
        {results?
        results.map((result)=>(
          <UsersComponent key={result._id} user={user} result={result} token={token}  chats={chats} setChats={setChats} setDisp={setDisp} setSearch={setSearch} setShowcross={setShowcross}/>
        )):''
      }
      </div>

      <div className='allchats' style={styles1}>
        {chats?
        chats.map(chat=>(
          <ChatComponent key={chat._id} chat={chat} user={user}  />
        )):''
        }
      </div>

      <div className="offcanvas offcanvas-start"  tabIndex="-1" id="groupcomponent" aria-labelledby="groupcomponentLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="groupcomponentLabel">Create a group</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <Groupcomponent chats={chats} setChats={setChats}/>
        </div>
      </div>

      <div className="offcanvas offcanvas-start"  tabIndex="-1" id="notifcomponent" aria-labelledby="notifcomponentLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="notifcomponentLabel">New Messages</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        {notification.length!=0?
        <div className="offcanvas-body">
        {notification.map(x=>(
          <Notification x={x} key={x._id}/>
        ))}
      </div>:
      <div className="offcanvas-body text-center" style={{fontSize:'20px'}}>No New Messages</div>}
      </div>
      
  </div>}
  </div>
  )
}

export default Allchats








