import { ChatState } from "../Context/Chatprovider"

export default function ChatComponent({user,chat}){
    
    const {selectedchat,setSelectedchat,render,setRender}=ChatState()

 
    const getsender=(user,chat)=>{
      return chat.users[0]?._id==user._id?chat.users[1]:chat.users[0]
    }
    
    let chatname=chat.isGroup?chat.chatName:getsender(user,chat)?.name
    let pic=chat.isGroup?"https://cdn6.aptoide.com/imgs/1/2/2/1221bc0bdd2354b42b293317ff2adbcf_icon.png":getsender(user,chat)?.profilepic
  
    return(
      <div className='usercont' style={{backgroundColor:chat._id===selectedchat?._id?'rgba(17,40,40,255)':'rgba(17,27,33,255)'}} onClick={()=>{
        setSelectedchat({...chat,sender:chatname,profilepic:pic})
        setRender(!render)
      }}>
        <img className='userimg' src={pic}></img>
        <div className='userinfo'>
          <div className='username'>{chatname}</div>
          <div className='useremail'>{chat.latestMessage?.content}</div>
        </div>
      </div>
    )
  }