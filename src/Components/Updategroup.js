import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatState } from '../Context/Chatprovider'

const Updategroup = ({users,setUsers}) => {
    const {selectedchat,setSelectedchat,render,setRender}=ChatState()
    
    const [name,setName]=useState('')
    const [results,setResults]=useState([])
    
    const user=JSON.parse(localStorage.getItem('userInfo'))
    const token=user.token

    async function handlerename(){
        const getsender=(user,chat)=>{
            return chat.users[0]?._id==user._id?chat.users[1]:chat.users[0]
          }
          
        try {
            await axios.put('https://interactivechat-backend.onrender.com/chats/renamegroup',{
                name:name,
                chatId:selectedchat._id
            },{
                headers:{
                    "access-token":token
                }
            }).then(resp=>{
                let chat=resp.data
                let chatname=chat.isGroup?chat.chatName:getsender(user,chat)?.name
                let pic=chat.isGroup?"https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png":getsender(user,chat)?.profilepic
                setName('')
                setRender(!render)
                setSelectedchat({...resp.data,sender:chatname,profilepic:pic})
            })
        } catch (error) {
            console.log(error)
        }
    }

    async function getsearchedData(){
        try {
          await axios.get('https://interactivechat-backend.onrender.com/register/signup?search=',{
          headers:{
              "access-token":token
          }
      }).then(response=>{
        setResults(response.data)
        let res=[]
        for(let i=0;i<response.data.length;i++){
            let bool=false
            for(let j=0;j<selectedchat.users.length;j++){
                if(response.data[i]._id==selectedchat.users[j]._id)bool=true
            }
            if(bool==false)res.push(response.data[i])
            }
        setUsers(res)    
})
        } catch (error) {
          console.log(error)
        }
      }

      const handleadd=async(id)=>{
        const getsender=(user,chat)=>{
            return chat.users[0]?._id==user._id?chat.users[1]:chat.users[0]
          }
          
        try {
            await axios.put('https://interactivechat-backend.onrender.com/chats/addtogroup',{
                newuserId:id,
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
            })
        } catch (error) {
            console.log(error)
        }
    }
    
      
  return (
    <div >
        <div className='d-flex'>
            <input className='form-control' type={'text'} value={name} placeholder='Enter new name'   onChange={(e)=>{setName(e.target.value)}} />
            <button className='btn btn-outline-primary' data-bs-target='#userprofile' data-bs-dismiss="offcanvas" aria-label="Close" onClick={()=>{
                if(name.trim()!==''){
                    handlerename()
                }
            }} >Update</button>
        </div>

      <button className='btn btn-outline-primary' style={{margin:'10px',display:user._id==selectedchat.groupAdmin?._id?'':'none'}} onClick={()=>{getsearchedData()}} >Add Participants</button>

      <div className='tags' style={{display:selectedchat.isGroup?'':'none'}}>
        {users?
        users.map((x)=>(
            <div className='tag' key={x._id} style={{fontSize:'18px'}}>{x.name}  <span><i className="bi bi-plus-circle-fill" onClick={()=>{
                handleadd(x._id)
                setUsers([...users.filter(b=>b._id!=x._id)])
            }}></i></span></div>
        ))
        :''}
        </div>
         
    </div>
  )
}

export default Updategroup