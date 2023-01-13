import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import InputEmoji from "react-input-emoji";
import { format } from 'timeago.js';
import { io } from 'socket.io-client';
import { ChatState } from '../Context/Chatprovider';
import './Chat.css';
import Updategroup from './Updategroup';

let socket,selectedChatCompare;

const Chat = () => {

  const {selectedchat,setSelectedchat,render,setRender,notification,setNotification}=ChatState()
  const user=JSON.parse(localStorage.getItem('userInfo'))
  const token=user.token
  const [text, setText] = useState("")
  const [messages,setMessages]=useState([])
  const [socketconnected,setSocketconnected]=useState(false)

  async function sendmessage(){
    try {
      await axios.post('https://interactivechat-backend.onrender.com/messages/sendmessage',
      {
        content:text,
        chatId:selectedchat._id
      },{
      headers:{
          "access-token":token
      }
      }).then(response=>{
        socket.emit("new message",response.data)
        setMessages([...messages,response.data])
        setRender(!render)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const [disp,setDisp]=useState('none')
  const styles1={
    display:disp
  }

  async function getallmessages(){
    if(selectedchat){
      setDisp('')
      try {
        await axios.get(`https://interactivechat-backend.onrender.com/messages/getallmessages/${selectedchat._id}`,{
        headers:{
            "access-token":token
        }
        }).then(response=>{
          socket.emit("join chat",selectedchat._id)
          setDisp('none')
          setMessages(response.data)
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(()=>{
    socket=io('https://interactivechat-backend.onrender.com')
    socket.emit("setup",user)
    socket.on("connected",()=>setSocketconnected(true))
  },[])
  
  useEffect(()=>{
    getallmessages()
    selectedChatCompare=selectedchat
  },[selectedchat])

  useEffect(()=>{
    socket.on("received message",async(newmessage)=>{
      if(!selectedChatCompare || selectedChatCompare._id!==newmessage.chat._id){
        setNotification([newmessage,...notification])
      }
      else{
        setMessages([...messages,newmessage])
      }
    })
  })

  function issameuser(messages,message,index){
    return (
      index>0 && messages[index-1].sender._id===message.sender._id
    )
  }

  function handleOnEnter(){
    if(text=='')return
    sendmessage()
  }

  const setref=useCallback((node)=>{
    if(node){
      node.scrollIntoView({smooth:true})
    }
  },[])

  const [users,setUsers]=useState([])

  const handleremove=async(tag)=>{
    const getsender=(user,chat)=>{
        return chat.users[0]?._id==user._id?chat.users[1]:chat.users[0]
      }
      
    try {
        await axios.put('https://interactivechat-backend.onrender.com/chats/removefromgroup',{
            userId:tag._id,
            chatId:selectedchat._id
        },{
            headers:{
                "access-token":token
            }
        }).then(resp=>{
            let chat=resp.data
            let chatname=chat.isGroup?chat.chatName:getsender(user,chat)?.name
            let pic=chat.isGroup?"https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png":getsender(user,chat)?.profilepic
            setSelectedchat({...resp.data,sender:chatname,profilepic:pic})
            setUsers([tag,...users])
        })
    } catch (error) {
        console.log(error)
    }
}

  return (
    selectedchat?
    <div className='chatbox '>

        <div className='chatboxheader'  >
            <div  className='d-flex align-items-center' style={{width:'100%'}}>
            <span><i  className="bi bi-arrow-left-short"  onClick={()=>{
              setSelectedchat('')
              setRender(!render)
              }}></i></span>
            <div style={{width:'100%'}} data-bs-toggle="offcanvas" data-bs-target="#userprofile" aria-controls="userprofile">
              <img className='userimg' src={selectedchat.profilepic}></img>
            <span className='username'>{selectedchat.sender}</span></div>
            </div>
        </div> 
          
          
        <div className='messagebox'>
          <div className="text-center text-white spin" style={styles1}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          
          {messages && disp!=''?
          messages.map((message,index)=>(
            <div ref={messages.length-1===index?setref:null} key={message._id}  style={{display:'flex',justifyContent:message.sender._id===user._id?'end':'start'}}>
              <div  className='message' style={{
              backgroundColor:message.sender._id!==user._id?'rgba(30,45,54,200)':'rgba(0,92,75,255)',
              marginTop:issameuser(messages,message,index)?3:10
              }}>
              {selectedchat.isGroup?
              <div className='sendername'>
                {message.sender._id!==user._id?message.sender.name:'You'}
              </div>
              :''}
              <div className='content'>{message.content}</div>
              <sub className='timeago'>{format(message.createdAt)}</sub>
            </div>
            </div>
          )):''}
        </div>
        
        <div className="input">
          <InputEmoji 
            value={text}
            onChange={setText}
            cleanOnEnter
            onEnter={handleOnEnter}
            placeholder="Type a message"
          />
          <i className="bi bi-send-fill text-white" style={{display:text==''?'none':''}} onClick={()=>{
            handleOnEnter()
            setText('')
          }} ></i>
        </div>

        <div className="offcanvas offcanvas-end" tabIndex="-1" id="userprofile" aria-labelledby="userprofileLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="userprofileLabel">Profile</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body">
          <div className='d-flex align-items-center flex-column '>
            <img className='canvasimg' src={selectedchat.profilepic}></img>
            <div className='profilename'>{selectedchat.sender}</div>
          </div>

          <div style={{display:selectedchat.isGroup?'':'none',fontWeight:'bold'}} >Participants: </div>
          
          <div className='tags' style={{display:selectedchat.isGroup?'':'none'}}>
            {selectedchat.users.map((tag,index)=>(
                <span key={tag._id} className='tag' style={{fontSize:'18px'}}>{tag._id===user._id?'You':tag.name} <span><i className="bi bi-x-circle-fill" style={{ display:user._id==selectedchat.groupAdmin?._id && tag._id!==selectedchat.groupAdmin._id?'':'none'}}  onClick={()=>{handleremove(tag)}} ></i></span> </span>
            ))}
        </div>
          
          <div style={{display:selectedchat.isGroup?'':'none'}}><Updategroup users={users} setUsers={setUsers} /></div>
         
          </div>
        </div>

    </div>:<div className='chatbox'></div>
  )
}

export default Chat


/* */