import axios from "axios"
import { ChatState } from "../Context/Chatprovider"

export default function Notification({x}){

    const {setSelectedchat,notification,setNotification}=ChatState()
    const user=JSON.parse(localStorage.getItem('userInfo'))
  
    const getsender=(user,chat)=>{
      return chat.users[0]?._id==user._id?chat.users[1]:chat.users[0]
    }
  
    let chatname=x.chat.isGroup?x.chat.chatName:getsender(user,x.chat)?.name
    let pic=x.chat.isGroup?"https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png":getsender(user,x.chat)?.profilepic
  
    const handlefunction=async()=>{
      let notifs=[...notification].filter(mess=>mess._id!==x._id)
      setNotification(notifs)
      setSelectedchat({...x.chat,sender:chatname,profilepic:pic})
    }
    return(
      <div className='notification' onClick={handlefunction} data-bs-dismiss="offcanvas" data-bs-target="#notifcomponent" aria-label="Close">
        {x.chat.isGroup?`New Message in ${x.chat.chatName}`:`New Message from ${chatname}`}
      </div>
    )
  }